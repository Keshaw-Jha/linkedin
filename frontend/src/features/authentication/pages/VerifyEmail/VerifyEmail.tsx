import { useState, type SubmitEvent } from "react";
import { Box } from "../../components/Box/Box";
import { Input } from "../../components/Input/Input";
import { AuthenticationLayout } from "../../components/AuthenticationLayout/AuthenticationLayout";
import classes from "./VerifyEmail.module.scss";
import { Button } from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useAuthentication, type User } from "../../contexts/AuthenticationContextProvider";

export default function VerifyEmail() {
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useAuthentication();

  const validateEmail = async (code: string) => {
    setMessage("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/authentication/validate-email-verification-token?token=${code}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.ok) {
        setErrorMessage("");
        if (user) {
          setUser((prev: User | null) =>
            prev ? { ...prev, emailVerified: true } : prev,
          );
        }
        navigate("/");
        return;
      }
      const { message } = await response.json();
      setErrorMessage(message);
    } catch (e) {
      console.log(e);
      setErrorMessage("Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmailVerificationToken = async () => {
    setErrorMessage("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/authentication/send-email-verification-token`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.ok) {
        setErrorMessage("");
        setMessage("Code sent successfully. Please check your email.");
        return;
      }
      const { message } = await response.json();
      setErrorMessage(message);
    } catch (e) {
      console.log(e);
      setErrorMessage("Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitOnClick = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const code = e.currentTarget.code.value;
    await validateEmail(code);
    setIsLoading(false);
  };

  return (
    <div className={classes.root}>
      <Box>
        <h1>Verify your email</h1>
        <form onSubmit={submitOnClick}>
          <p>
            Only one step left to complete your resignation. Verify your email
            address.
          </p>
          <Input type="text" label="Verification code" key="code" name="code" />
          {message && <p style={{ color: "green" }}>{message}</p>}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Button type="submit" disabled={isLoading}>
            Validate email
          </Button>
          <Button
            outline
            type="button"
            disabled={isLoading}
            onClick={sendEmailVerificationToken}>
            Send again
          </Button>
        </form>
      </Box>
    </div>
  );
}
