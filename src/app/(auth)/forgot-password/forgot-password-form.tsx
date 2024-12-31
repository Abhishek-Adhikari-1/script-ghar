"use client";

import { useState } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";

import { ForgotPasswordEmailForm } from "./forgot-email";
import { ForgotPasswordPhoneForm } from "./forgot-phone";

export type ForgotPasswordFormProps = {
  toggleFormState: {
    usePhone: boolean;
    useEmail: boolean;
  };
  setToggleFormState: React.Dispatch<
    React.SetStateAction<{
      usePhone: boolean;
      useEmail: boolean;
    }>
  >;
};

export const ForgotPasswordForm = () => {
  const [toggleFormState, setToggleFormState] = useState({
    usePhone: false,
    useEmail: true,
  });

  return (
    <>
      <CardWrapper
        title="Forgot Password"
        description={
          toggleFormState.usePhone
            ? "Enter your phone number to receive an OTP"
            : "Enter your email to receive an OTP mail"
        }
        footer="Don't have an account?"
        footerLink="Sign Up"
        footerHref="/sign-up"
        isPending={false}
        showSocial={false}
      >
        {!toggleFormState.usePhone && toggleFormState.useEmail && (
          <ForgotPasswordEmailForm
            toggleFormState={toggleFormState}
            setToggleFormState={setToggleFormState}
          />
        )}

        {toggleFormState.usePhone && !toggleFormState.useEmail && (
          <ForgotPasswordPhoneForm
            toggleFormState={toggleFormState}
            setToggleFormState={setToggleFormState}
          />
        )}
      </CardWrapper>
    </>
  );
};
