import Header from "@/components/shared/Header";
import { transformationTypes } from "@/constants";

// Get the type from the params in the URL
const AddTransformationTypePage = ({params: {type}}: SearchParamProps) => {

  // Get the current type from the param
  const transformation = transformationTypes[type]
  return (
    <Header
       title={transformation.title}
       subtitle={transformation.subTitle}
    />
  )
}
export default AddTransformationTypePage