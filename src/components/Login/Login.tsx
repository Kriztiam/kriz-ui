"use client";

import styles from "./Login.module.css";
import { useId } from "react";
import Button from "@/components/Button/Button";
import InputCheckbox from "@/components/InputCheckbox/InputCheckbox";
import InputText from "@/components/InputText/InputText";
import Tabs from "@/components/Tabs/Tabs";

export default function Login({
  textLogin = "Login",
  textRegister = "Register",
  textFullName = "Full name",
  textEmail = "Email",
  textPassword = "Password",
  textVerifyPassword = "Verify password",
  textForgotPassword = "Forgot Password?",
  textRememberMe = "Remember me on this device",
  textLoginButton = "Log In",
  textRegisterButton = "Sign up",
  hrefForgotPassword = "/",
}: {
  textLogin?: string;
  textRegister?: string;
  textFullName?: string;
  textEmail?: string;
  textPassword?: string;
  textVerifyPassword?: string;
  textForgotPassword?: string;
  textRememberMe?: string;
  textLoginButton?: string;
  textRegisterButton?: string;
  hrefForgotPassword?: string;
}) {
  const uniqueId = useId();

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Tabs
      simpleStyle
      tabsNames={[textLogin, textRegister]}
      tabsContent={[
        <>
          <form className={styles.Form} onSubmit={handleLogin}>
            <InputText
              type="email"
              id={uniqueId + "-login-email"}
              labelText={textEmail}
            />
            <InputText
              type="password"
              id={uniqueId + "-login-password"}
              labelText={textPassword}
            />
            <a
              href={hrefForgotPassword}
              target="_blank"
              rel="noopener noreferrer"
            >
              {textForgotPassword}
            </a>
            <InputCheckbox
              id={uniqueId + "-login-remember-user"}
              labelText={textRememberMe}
              defaultChecked
            />
            <Button type="submit">{textLoginButton}</Button>
          </form>
        </>,
        <>
          <form className={styles.Form} onSubmit={handleRegister}>
            <InputText
              id={uniqueId + "-register-fullName"}
              labelText={textFullName}
            />
            <InputText
              type="email"
              id={uniqueId + "-register-email"}
              labelText={textEmail}
            />
            <InputText
              type="password"
              id={uniqueId + "-register-password"}
              labelText={textPassword}
            />
            <InputText
              type="password"
              id={uniqueId + "-register-verify-password"}
              labelText={textVerifyPassword}
            />
            <Button type="submit">{textRegisterButton}</Button>
          </form>
        </>,
      ]}
    />
  );
}
