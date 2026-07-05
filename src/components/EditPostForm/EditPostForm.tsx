import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";

import css from "./EditPostForm.module.css";
import type { Post } from "../../types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../services/postService";
import toast from "react-hot-toast";
const Schema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 symbols")
    .max(50, "Title must be less than 50 symbols")
    .required("Title must be required"),
  body: Yup.string()
    .max(500, "Content must be less than 500 symbols")
    .required("Content must be required"),
});
interface EditPostFormProps {
  post: Post;
  onClose: () => void;
}
export default function EditPostForm({ post, onClose }: EditPostFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      onClose();
      toast.success("Post is successfully edit!");
    },
  });
  const handleOnSubmit = (values: Post) => {
    mutation.mutate(values);
  };
  return (
    <Formik initialValues={post} onSubmit={handleOnSubmit} validationSchema={Schema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={mutation.isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
