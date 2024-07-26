import { RegisterForm } from '@/app/(auth)/register/register-form';
import React from 'react';

export default function Register() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-center">Đăng ký</h1>
      <div className="flex justify-center ">
        <RegisterForm />
      </div>
    </div>
  );
}
