import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import * as Yup from "yup";
import { attemptLogin } from "../store/thunks/auth";
import { Error } from "../components";
import { Credentials } from "src/store/actions/user";
import { useAppSelector, useAppDispatch } from "src/store/hooks";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

type FormValues = Credentials;

export default function LoginPage() {
  const { isAuth } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [serverError, setServerError] = useState("");

  const validationSchema = Yup.object({
    username: Yup.string().min(3).max(50).required("Required"),
    password: Yup.string().min(5).max(255).required("Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const onSubmit = (values: FormValues) => {
    dispatch(attemptLogin(values)).catch(({ response }) => {
      if (response.data.message) {
        setServerError(response.data.message);
      } else {
        setServerError("Unexpected error occured");
      }
    });
  };

  return isAuth ? (
    <Redirect to='/home' />
  ) : (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit(onSubmit)}>
        <div className='field'>
          <label htmlFor='username'>Username</label>
          <input {...register("username")} />
          {errors.username && <Error>{errors.username.message}</Error>}
        </div>
        <div className='field'>
          <label htmlFor='password'>Password</label>
          <input {...register("password")} type='password' />
          {errors.password && <Error>{errors.password.message}</Error>}
        </div>
        <div>
          <Link to='/login/forgot'>Forgot your password?</Link>
        </div>
        <button type='submit' disabled={!isValid}>
          Login
        </button>
        {serverError && <Error>{serverError}</Error>}
      </form>
      <b>Or</b>
      <Link to='/register'>Sign Up</Link>
    </div>
  );
}
