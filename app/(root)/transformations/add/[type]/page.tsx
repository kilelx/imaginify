import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Get the type from the params in the URL
const AddTransformationTypePage = async ({params: {type}}: SearchParamProps) => {

  const { userId } = auth();

  // Because TS complains that userId can be null
  if(!userId) redirect('/sign-in')

  // Get the user from the DB, it's a server action
  const user = await getUserById(userId)

  // Get the current type from the param
  const transformation = transformationTypes[type]
  return (
    <>
      <Header
         title={transformation.title}
         subtitle={transformation.subTitle}
      />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  )
}
export default AddTransformationTypePage