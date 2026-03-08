"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

type Props = {
  onSubmit: (values: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<void>
  loading?: boolean
  className?: string
}

export function SignupForm({
  onSubmit,
  loading = false,
  className,
}: Props) {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await onSubmit({ name, email, password, confirmPassword })
  }

  return (
    <div className={className}>

      <Card>

        <CardHeader>
          <CardTitle>Create an account</CardTitle>

          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit}>

            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="name">
                  Username
                </FieldLabel>

                <Input
                  id="name"
                  type="text"
                  value={name}
                  placeholder="johndoe"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />

                <FieldDescription>
                  We'll use this to contact you. We will not share your email.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>

                <Input
                  id="password"
                  type="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />

                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>

                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  required
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                />

                <FieldDescription>
                  Please confirm your password.
                </FieldDescription>
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Creating account..." : "Create account"}
                </Button>

                <FieldDescription className="text-center mt-4">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="underline"
                  >
                    Sign in
                  </Link>
                </FieldDescription>

              </Field>

            </FieldGroup>

          </form>

        </CardContent>

      </Card>

    </div>
  )
}