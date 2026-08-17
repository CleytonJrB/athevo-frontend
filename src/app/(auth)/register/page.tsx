import CommonBody from "@/components/layout/common-body"
import { RegisterForm } from "./_components/register-form"
import Footer from "@/components/layout/footer"

export default function RegisterPage() {
  return (
    <CommonBody hasName showHeader hasNavigations hiddenBackgroundBlur={true}>
      <section className="mx-auto flex w-full flex-1 items-center">
        <div className="w-full backdrop-blur py-8">
          <RegisterForm />
        </div>
      </section>

      <Footer />
    </CommonBody>
  )
}
