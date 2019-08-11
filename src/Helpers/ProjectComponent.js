import React from 'react';
import { Button, Form } from 'semantic-ui-react';

const btnText = index => index === -1 ? "Add New Project" : "Update";

const ProjectComponent = (props) => {

    return (
        <React.Fragment>
            <Form.Input
                fluid
                label="Heading"
                style={{ margin: '1%' }}
                value={props.Project.heading}
                onChange={(event) => { props.onChangeHandler(event, props.ProjectIndex, "heading") }}
            />
            <Form.Input
                fluid
                label="Type of Project"
                style={{ margin: '1%' }}
                value={props.Project.typeOfProject}
                onChange={(event) => { props.onChangeHandler(event, props.ProjectIndex, "typeOfProject") }}
            />
            <Form.Input
                fluid
                label="Description"
                style={{ margin: '1%' }}
                value={props.Project.description}
                onChange={(event) => { props.onChangeHandler(event, props.ProjectIndex, "description") }}
            />
            <Form.Input
                fluid
                label="Link to Project"
                style={{ margin: '1%' }}
                value={props.Project.buttonLink}
                onChange={(event) => { props.onChangeHandler(event, props.ProjectIndex, "buttonLink") }}
            />
            <Form.Input
                fluid
                label="Text For Project Link Button"
                style={{ margin: '1%' }}
                value={props.Project.buttonText}
                onChange={(event) => { props.onChangeHandler(event, props.ProjectIndex, "buttonText") }}
            />
            <Form.Input
                fluid label="Project Background"
                style={{ margin: '1%' }}
                action={{ icon: 'history', onClick: () => props.onClickDefaultButtonHandler(props.ProjectIndex, "backgroundColor") }}
                placeholder='#4E4E4E' value={props.Project.backgroundColor}
                onChange={(event) => { props.onChangeHandler(event, props.ProjectIndex, "backgroundColor") }} />
            <Form.Input fluid
                label="Text Color"
                style={{ margin: '1%' }}
                action={{ icon: 'history', onClick: () => props.onClickDefaultButtonHandler(props.ProjectIndex, "textColor") }}
                placeholder='#000000'
                value={props.Project.textColor}
                onChange={(event) => { props.onChangeHandler(event, props.ProjectIndex, "textColor") }} />
            <Form.Input fluid
                label="Button Background Color"
                style={{ margin: '1%' }}
                action={{ icon: 'history', onClick: () => props.onClickDefaultButtonHandler(props.ProjectIndex, "buttonColor") }}
                placeholder='#42DEEE' value={props.Project.buttonColor}
                onChange={(event) => { props.onChangeHandler(event, props.ProjectIndex, "buttonColor") }} />
            <Form.Input fluid
                label="Button Text Color"
                style={{ margin: '1%' }}
                action={{ icon: 'history', onClick: () => props.onClickDefaultButtonHandler(props.ProjectIndex, "buttonTextColor") }}
                placeholder='#FFFFFF'
                value={props.Project.buttonTextColor}
                onChange={(event) => { props.onChangeHandler(event, props.ProjectIndex, "buttonTextColor") }} />
            <img src={props.Project.projectImage}
                alt="" style={{ maxWidth: "30%", height: "auto" }}></img>
            <Form.Input
                fluid
                label="Input Image"
                style={{ margin: '1%' }}
                type="file"
                accept="image/*"
                onChange={(e) => props.onChangeFileHandler(e, props.ProjectIndex)} />
            <div style={{ width: "100%", textAlign: "center" }}>
                <Button positive disabled={props.Project.changed ? false : true} size={"big"} onClick={(e) => { props.onFinalSubmitButton(e, props.ProjectIndex) }}>{btnText(props.ProjectIndex)}</Button>
                {
                    props.ProjectIndex === -1 ? <React.Fragment></React.Fragment> : <Button negative size={"big"} onClick={(event) => { props.onFinalDeleteHandler(event, props.ProjectIndex) }}>Delete</Button>
                }
            </div>
        </React.Fragment>
    )
}

export default ProjectComponent;