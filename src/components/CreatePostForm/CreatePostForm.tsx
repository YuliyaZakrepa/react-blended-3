import * as Yup from "yup";
import { Field, Form, Formik, type FormikHelpers, ErrorMessage } from "formik";

import css from "./CreatePostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../services/postService";
import toast from "react-hot-toast";
interface CreatePostFormProps {
  onClose: () => void;
}
const Schema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 symbols")
    .max(50, "Title must be less than 50 symbols")
    .required("Title must be required"),
  body: Yup.string()
    .max(500, "Content must be less than 500 symbols")
    .required("Content must be required"),
});
export default function CreatePostForm({ onClose }: CreatePostFormProps) {
  interface CreatePostFormValues {
    title: string;
    body: string;
  }
  const initialValues: CreatePostFormValues = {
    title: "",
    body: "",
  };
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      onClose();
      toast.success("Post is successfully created!");
    },
  });
  const handleOnSubmit = (
    values: CreatePostFormValues,
    actions: FormikHelpers<CreatePostFormValues>
  ) => {
    mutation.mutate(values);
    actions.resetForm();
  };
  return (
    <Formik initialValues={initialValues} onSubmit={handleOnSubmit} validationSchema={Schema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows="8" className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            Create post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
