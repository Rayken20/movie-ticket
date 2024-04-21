import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";

function SignUp({ setUser }) {
  const history = useHistory();
  function validate(values) {
    const errors = {};
    if (!values.username) {
      errors.username = "Username is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    if (!values.passwordConfirmation) {
      errors.passwordConfirmation = "Password confirmation is required";
    } else if (values.password !== values.passwordConfirmation) {
      errors.passwordConfirmation = "Passwords do not match";
    }
    return errors;
  }

  function handleSubmit(values, { setSubmitting }) {
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
        email: values.email,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      }),
    })
      .then((r) => {
        if (r.ok) {
          return r.json();
        } else {
          throw new Error("Failed to sign up");
        }
      })
      .then((user) => {
        setUser(user);
        setSubmitting(false);
        history.push('/dashboard')
      })
      .catch((error) => {
        console.error("Error:", error);
        setSubmitting(false);
      });
  }

  return (
    <div className="container">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          passwordConfirmation: "",
        }}
        validate={validate}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <h1>Sign Up</h1>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <Field
                type="text"
                className="form-control"
                id="username"
                name="username"
                autoComplete="off"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Field
                type="email"
                className="form-control"
                id="email"
                name="email"
                autoComplete="off"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Field
                type="password"
                className="form-control"
                id="password"
                name="password"
                autoComplete="current-password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordConfirmation" className="form-label">
                Password Confirmation
              </label>
              <Field
                type="password"
                className="form-control"
                id="passwordConfirmation"
                name="passwordConfirmation"
                autoComplete="current-password"
              />
              <ErrorMessage
                name="passwordConfirmation"
                component="div"
                className="text-danger"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignUp;
