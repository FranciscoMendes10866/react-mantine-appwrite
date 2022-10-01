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

import { useAuth } from "../contexts/Auth";

const schema = Joi.object({
  username: Joi.string().min(2).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(6).max(24).required(),
  repeatPassword: Joi.string().valid(Joi.ref("password")).required(),
});

interface IFormValues {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export const SignUp = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const form = useForm<IFormValues>({
    validate: joiResolver(schema),
    initialValues: {
      username: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const handleOnSubmit = useCallback(
    async (values: IFormValues) => {
      try {
        await auth?.createAccount(values);
        await auth?.login(values.email, values.password);
        form.reset();
        navigate("/editor");
      } catch (err) {
        console.error(err);
      }
    },
    [auth, form]
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
          Create account
        </Title>

        <form onSubmit={form.onSubmit(handleOnSubmit)}>
          <TextInput
            label="Username"
            placeholder="username"
            size="md"
            {...form.getInputProps("username")}
          />
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
          <PasswordInput
            label="Repeat password"
            placeholder="Password"
            mt="md"
            size="md"
            {...form.getInputProps("repeatPassword")}
          />
          <Button fullWidth mt="xl" size="md" type="submit">
            Sign Up
          </Button>
        </form>

        <Text align="center" mt="md">
          Already have an account?{" "}
          <Anchor component={Link} weight={700} to="/sign-in">
            Sign In
          </Anchor>
        </Text>
      </Paper>
    </Center>
  );
};
