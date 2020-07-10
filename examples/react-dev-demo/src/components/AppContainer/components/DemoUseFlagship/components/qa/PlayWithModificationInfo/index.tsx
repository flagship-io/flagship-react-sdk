import { useFlagship } from '@flagship.io/react-sdk';
import { Formik } from 'formik';
import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const PlayWithModificationInfo: React.FC = () => {
    const [hasError, setError] = React.useState(false);
    const [fsParams, setFsParams] = React.useState('color');
    const [fsOutput, setFsOutput] = React.useState<any>({ data: null, loading: false, noCall: true });
    const { getModificationInfo } = useFlagship();

    const handleDisplay = () => {
        if (fsOutput.data === null) {
            return fsOutput.noCall
                ? 'Please click "Apply change"to see the result.'
                : 'getModificationInfo returned "null"';
        } else {
            if (fsOutput.loading) {
                return 'Loading...';
            }
            return (
                <JSONInput
                    waitAfterKeyPress={3000}
                    id="fsGetModificationOutput"
                    placeholder={fsOutput.data}
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
            );
        }
    };
    return (
        <>
            <Formik
                initialValues={{
                    fsParams
                }}
                validate={(values) => {
                    const errors: any = {};

                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(false);
                    setFsOutput({ data: {}, loading: true });
                    setFsParams(values.fsParams);
                    if (getModificationInfo) {
                        getModificationInfo(values.fsParams)
                            .then((response) => {
                                setFsOutput({ data: response, loading: false });
                            })
                            .catch((e) => {
                                setFsOutput({ data: { error: e.message }, loading: false });
                            });
                    } else {
                        // nothing
                    }
                }}
            >
                {({ handleSubmit, handleChange, handleBlur, setFieldValue, values, touched, isValid, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Form.Group as={Col} md="12" controlId="modificationInfoKey">
                            <Form.Label>Modification key</Form.Label>
                            <Form.Control
                                type="text"
                                name="fsParams"
                                value={values.fsParams}
                                onChange={handleChange}
                                isValid={touched.fsParams && !errors.fsParams}
                                isInvalid={!!errors.fsParams}
                            />
                            <Form.Control.Feedback type="invalid">{errors.fsParams}</Form.Control.Feedback>
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
            <div className="mv3 b">getModificationInfo output:</div>
            <div className="mb3">{handleDisplay()}</div>
        </>
    );
};

export default PlayWithModificationInfo;
