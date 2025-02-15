import { useEffect, useState, useCallback } from "react";
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import api from "../../util/axios";

const apiRequest = async (url: string, email: string, password: string) => {
  try {
    const resp = await api.post(url, { email, password });
    return resp.data;
  } catch (axiosError: any) {
    throw new Error(
      axiosError?.response?.data?.error ||
        "Something went wrong. Please try again."
    );
  }
};

export function AuthenticationForm() {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("pistol");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //  Redirecting to home if already logged in
  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  //  Handling form submission for login/register
  const handleSubmit = useCallback(async () => {
    setError(null);
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isRegistering
        ? "https://reqres.in/api/register"
        : "https://reqres.in/api/login";

      const data = await apiRequest(endpoint, email, password);
      login(data.token, { email });
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [email, password, isRegistering, login, navigate]);

  return (
    <Container size={420} my={rem(40)}>
      <Title ta="center">{isRegistering ? "Register" : "Sign In"}</Title>

      <Paper withBorder shadow="md" p={30} mt="xl" radius="md">
        <TextInput
          label="Email"
          placeholder="eve.holt@reqres.in"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          required
        />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          required
          mt="md"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />
        {error && (
          <Text color="red" ta="center" mt="sm">
            {error}
          </Text>
        )}

        <Button onClick={handleSubmit} loading={loading} fullWidth mt="xl">
          {isRegistering ? "Register" : "Log In"}
        </Button>
      </Paper>

      <Anchor
        component="button"
        size="sm"
        onClick={() => setIsRegistering((prev) => !prev)}
        mt="md"
      >
        {isRegistering
          ? "Already have an account? Sign In"
          : "Don't have an account? Register"}
      </Anchor>
    </Container>
  );
}
