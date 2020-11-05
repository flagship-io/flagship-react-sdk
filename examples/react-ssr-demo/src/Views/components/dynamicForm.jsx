const React = require('react');
const Form = require('react-bootstrap').Form;
const FormLabel = require('react-bootstrap').FormLabel;
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;
const Button = require('react-bootstrap').Button;
const useFlagship = require('@flagship.io/react-sdk').useFlagship;

const DynamicForm = () => {
    const fsParams = {
        modifications: {
            requested: [
                {
                    key: 'color',
                    defaultValue: '#FF33E3',
                    activate: false
                }
            ]
        }
    };
    const { modifications: fsModifications } = useFlagship(fsParams);

    const handleSubmit = (event) => {
        console.log('i was clicked');
        event.preventDefault();
    };

    return (
        <Form onSubmit={(event) => handleSubmit(event)}>
            <FormGroup controlId="personname">
                <FormLabel>Name</FormLabel>
                <FormControl type="text" />
            </FormGroup>
            <Button type="submit" style={{ backgroundColor: fsModifications.color }}>
                Submit
            </Button>
        </Form>
    );
};

module.exports = DynamicForm;
