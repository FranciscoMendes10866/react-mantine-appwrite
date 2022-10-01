import { useMemo } from "react";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SignUp } from "./pages/SignUp";
import { SignIn } from "./pages/SignIn";
import { Editor } from "./pages/Editor";

import { RequireAuth } from "./components/RequireAuth";

import { AuthProvider } from "./contexts/Auth";
import { EditorProvider } from "./contexts/Editor";

export const App = () => {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MantineProvider>
          <BrowserRouter>
            <Routes>
              <Route index element={<SignUp />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route element={<RequireAuth />}>
                <Route
                  path="/editor"
                  element={
                    <EditorProvider>
                      <Editor />
                    </EditorProvider>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </MantineProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
