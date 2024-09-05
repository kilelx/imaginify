"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { CustomField } from "./CustomField";
import { useState, useTransition } from "react";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import { Button } from "../ui/button";
import { updateCredits } from "@/lib/actions/user.actions";
import MediaUploader from "./MediaUploader";

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

function TransformationForm({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) {

    const transformationType = transformationTypes[type];
    const [image, setImage] = useState(data)
    // Keep track of transformation, type Transformations or null
    const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [transformationConfig, setTransformationConfig] = useState(config);
    const [isPending, startTransition] = useTransition();

  // If we have already filled the data before
  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,

          // If not, we get our values from constants
        }
      : defaultValues;

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  // onChangeField: function with a parameter (value) that returns nothing
  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    // Get the image size
    const imageSize = aspectRatioOptions[value as AspectRatioKey]

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }))

    setNewTransformation(transformationType.config);

    return onChangeField(value);
  }

  const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField:(value: string) => void) => {
    // debounce() is imported from /utils
    //I It waits 1000ms, and then submit the new value
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        // Go to a specific type (recolor, remove...)
        [type]: {
          // Spread all the properties
          ...prevState?.[type],
          // We use this expression to get a dynamic key
          [fieldName === 'prompt' ? 'prompt' : 'to']: value
        }
      }))
      return onChangeField(value)
    }, 1000)
  }

  // TODO: return to updateCredits
  const onTransformHandler = () => {
    setIsTransforming(true);

    setTransformationConfig(
      // Merge all the keys of the object to ensure they endup in a new object
      deepMergeObjects(newTransformation, transformationConfig)
    )

    setNewTransformation(null);

    startTransition(async () => {
      // await updateCredits(userId, creditFee)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
          // We destructure the field, and then pass the rest of the props
          render={({ field }) => <Input {...field} className="input-field" />}
        />
        {type === 'fill' &&
            <CustomField
              control={form.control}
              name="aspectRatio"
              formLabel="aspectRatio"
              className="w-full"
              render={({field}) => (
                <Select
                  onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                >
                  <SelectTrigger className="select-field">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Get the aspectRatioOptions in constants */}
                    {Object.keys(aspectRatioOptions).map((key) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="select-item"
                      >
                        {/* The compiler will assume it's a type AspectRatioKey */}
                        {aspectRatioOptions[key as AspectRatioKey].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
        }

        {(type === 'remove' || type === 'recolor') && (
          <div className="prompt-field">
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={
                type==='remove' ? 'Object to remove' : 'Object to recolor'
              }
              className="w-full"
              render={({field}) => (
                <Input
                  value={field.value}
                  className="input-field"
                  onChange={(e) => onInputChangeHandler(
                    'prompt',
                    e.target.value,
                    type,
                    field.onChange
                  )}
                />
              )}
            />

            {type === 'recolor' && (
              <CustomField
                control={form.control}
                name="color"
                formLabel="Replacement color"
                className="w-full"
                render={({field}) => (
                  <Input
                    value={field.value}
                    className="input-field"
                    onChange={(e) => onInputChangeHandler(
                      'color',
                      e.target.value,
                      'recolor',
                      field.onChange
                    )}
                  />
                )}
              />
            )}
          </div>
        )}

        <div className="media-uploader-field">
          <CustomField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({field}) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />
        </div>

      <div className="flex flex-col gap-4">
        <Button
          type="button"
          className="submit-button capitalize"
          disabled={isTransforming || newTransformation === null}
          onClick={onTransformHandler}
        >
          {isTransforming ? 'Transforming...' : 'Apply transformation'}
        </Button>

        <Button
          type="submit"
          className="submit-button capitalize"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting' : 'Save image'}
        </Button>
      </div>
      </form>
    </Form>
  );
}
export default TransformationForm;
