import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const Forms = ({ formType, handleSubmit }) => {
  const initialValues = formType === 'movie' ? { title: '', genre: '', director: '', releaseDate: '' } : { name: '', location: '', capacity: '' };

 
  return (
    <Formik
      initialValues={initialValues}
      
      onSubmit={(values, { resetForm }) => {
        handleSubmit(values);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          {formType === 'movie' ? (
            <>
              <div>
                <label htmlFor="title">Title:</label>
                <Field type="text" id="title" name="title" />
                <ErrorMessage name="title" component="div" />
              </div>
              <div>
                <label htmlFor="genre">Genre:</label>
                <Field type="text" id="genre" name="genre" />
                <ErrorMessage name="genre" component="div" />
              </div>
              <div>
                <label htmlFor="director">Director:</label>
                <Field type="text" id="director" name="director" />
                <ErrorMessage name="director" component="div" />
              </div>
              <div>
                <label htmlFor="releaseDate">Release Date:</label>
                <Field type="date" id="releaseDate" name="releaseDate" />
                <ErrorMessage name="releaseDate" component="div" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="name">Name:</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" />
              </div>
              <div>
                <label htmlFor="location">Location:</label>
                <Field type="text" id="location" name="location" />
                <ErrorMessage name="location" component="div" />
              </div>
              <div>
                <label htmlFor="capacity">Capacity:</label>
                <Field type="number" id="capacity" name="capacity" />
                <ErrorMessage name="capacity" component="div" />
              </div>
            </>
          )}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default Forms;
