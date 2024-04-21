import React from "react";
import { Formik, Form, Field } from "formik";
import { useHistory } from "react-router-dom";

function Login({ setUser }) {
  const history = useHistory();
  return (
    <div>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values, actions) => {
          fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }).then((r) => {
            if (r.ok) {
              r.json().then((user) => {
                setUser(user);
                history.push("/dashboard")
              });
            }
          });
        }}
      >
        {(props) => (
          <Form>
            <h1>Login</h1>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Field
                type="text"
                id="username"
                name="username"
                autoComplete="off"
                className={`form-control ${
                  props.touched.username && props.errors.username ? "is-invalid" : ""
                }`}
              />
              {props.touched.username && props.errors.username && (
                <div className="invalid-feedback">{props.errors.username}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                className={`form-control ${
                  props.touched.password && props.errors.password ? "is-invalid" : ""
                }`}
              />
              {props.touched.password && props.errors.password && (
                <div className="invalid-feedback">{props.errors.password}</div>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
