import React from 'react';
import { useFlagship } from '@flagship.io/react-sdk';
import CodeBlock from '../../../../../../common/CodeBlock';
import { Button, Form, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const PlayWithModifications: React.FC = () => {
    const [hasError, setError] = React.useState(false);
    const [fsParams, setFsParams] = React.useState({
        modifications: {
            requested: [
                {
                    key: 'btnColor',
                    defaultValue: 'green',
                    activate: false
                }
            ]
        }
    });
    const output = useFlagship(fsParams);
    const { modifications: fsModifications } = output;
    return (
        <>
            <Formik
                initialValues={{
                    fsParams
                }}
                validate={(values) => {
                    const errors: any = {};
                    if (!values.fsParams) {
                        errors.fsParams = 'Required';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(false);
                    setFsParams({ ...values.fsParams });
                }}
            >
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    values,
                    touched,
                    isValid,
                    errors
                }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group as={Col} md="12" controlId="settingsForm">
                            <Form.Label>useFlagship arguments</Form.Label>
                            <JSONInput
                                id="fsParams"
                                placeholder={values.fsParams}
                                locale={locale}
                                height="550px"
                                width="100%"
                                onChange={({ error, jsObject }) => {
                                    if (!error) {
                                        setFieldValue(
                                            'fsParams',
                                            jsObject || {},
                                            true
                                        );
                                        setError(false);
                                    } else {
                                        setError(true);
                                    }
                                }}
                                style={{
                                    body: {
                                        fontSize: '16px'
                                    }
                                }}
                            />
                        </Form.Group>
                        <div className="flex justify-end ph3">
                            <Button
                                disabled={hasError}
                                variant="secondary"
                                type="submit"
                                style={{
                                    cursor: hasError ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Apply change
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
            <div className="mv3 b">useFlagship output:</div>
            <div className="mb3">
                <JSONInput
                    id="fsIutput"
                    placeholder={output}
                    locale={locale}
                    height="550px"
                    viewOnly={true}
                    width="100%"
                    style={{
                        body: {
                            fontSize: '16px'
                        }
                    }}
                />
            </div>
        </>
    );
};

export default PlayWithModifications;