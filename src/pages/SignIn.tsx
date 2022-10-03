import { useCallback } from "react";
import Joi from "joi";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Center,
} from "@mantine/core";
import { useForm, joiResolver } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { useAuth } from "../contexts/Auth";

const schema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).max(24).required(),
});

interface IFormValues {
  email: string;
  password: string;
}

export const SignIn = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const { mutateAsync: signinMutation } = useMutation(
    async ({ email, password }: IFormValues) => {
      return await auth?.login(email, password);
    }
  );

  const form = useForm<IFormValues>({
    validate: joiResolver(schema),
    initialValues: {
      email: "",
      password: "",
    },
  });

  const handleOnSubmit = useCallback(
    async (values: IFormValues) => {
      try {
        await signinMutation(values)
        navigate("/editor");
        form.reset();
      } catch (err) {
        console.error(err);
      }
    },
    [auth, form, signinMutation]
  );

  return (
    <Center
      component="div"
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Paper radius={0} p={30} style={{ width: 400 }}>
        <Title order={2} align="center" mt="md" mb={50}>
          Welcome back
        </Title>

        <form onSubmit={form.onSubmit(handleOnSubmit)}>
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            mt="md"
            size="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" size="md" type="submit">
            Sign In
          </Button>
        </form>

        <Text align="center" mt="md">
          Don&apos;t have an account?{" "}
          <Anchor weight={700} component={Link} to="/">
            Sign Up
          </Anchor>
        </Text>
      </Paper>
    </Center>
  );
};
