import React, { useState, useEffect } from 'react';
import { Tab, Accordion, Icon, Form } from 'semantic-ui-react';
import axios from './../Helpers/Axios';
import ProjectComponent from '../Helpers/ProjectComponent';


const ProjectSchema = {
    backgroundColor: "#4E4E4E",
    projectImage: "",
    heading: "",
    typeOfProject: "",
    description: "",
    textColor: "#000000",
    buttonLink: "",
    buttonText: "",
    buttonColor: "#42DEEE",
    buttonTextColor: "#FFFFFF",
    image: undefined
}

const Project = () => {
    const [loading, setloading] = useState(true);
    const [data, setdata] = useState([]);
    const [shouldUpdate, setshouldUpdate] = useState(true);
    const [activeIndex, setactiveIndex] = useState(-1);
    const [newProject, setNewProject] = useState({ ...ProjectSchema });

    useEffect(() => {
        axios.get("/api/project/")
            .then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    res.data[i].projectImage = `data:${res.data[i].projectImage.contentType};base64,
                    ${btoa(new Uint8Array(res.data[i].projectImage.data.data).reduce(function (data, byte) {
                        return data + String.fromCharCode(byte);
                    }, ''))
                        } `;
                }
                setdata(res.data);
                setloading(false);
            })
            .catch(err => {
                console.log(err);
                setloading(false);
            })

    }, [shouldUpdate]);

    const accordionClickHandler = (event, index) => {
        activeIndex === index ? setactiveIndex(-1) : setactiveIndex(index);
    }

    const checkValidation = (index, tempData) => {
        const isColor = (color) => {
            let ans = true;
            ans = ans && color.length === 7;
            if (!ans) {
                return ans;
            }
            for (let i = 0; i < color.length; i++) {
                const chr = color[i];
                if (i === 0) ans = ans && chr === '#';
                else ans = ans && ((chr <= 'F' && chr >= 'A') || (chr <= 'f' && chr >= 'a') || (chr >= '0' && chr <= '9'));
            }
            return ans;
        };
        return tempData.heading !== "" &&
            tempData.typeOfProject !== "" &&
            tempData.description !== "" &&
            tempData.buttonLink !== "" &&
            tempData.buttonText !== "" &&
            isColor(tempData.backgroundColor) &&
            isColor(tempData.textColor) &&
            isColor(tempData.buttonColor) &&
            isColor(tempData.buttonTextColor);
    }

    const onChangeHandler = (e, index, type) => {
        let thisData;
        if (index === -1) {
            thisData = { ...newProject };
        } else {
            thisData = [...data];
        }
        if (index === -1) {
            thisData[type] = e.target.value;
            thisData.changed = checkValidation(index, thisData);
            setNewProject(thisData);
        } else {
            thisData[index][type] = e.target.value;
            thisData[index].changed = checkValidation(index, thisData[index]);
            setdata(thisData);
        }
    }

    const onFinalSubmitButton = async (e, index) => {
        e.currentTarget.classList.add("loading");
        const form = new FormData();
        let thisData;
        if (index === -1) {
            thisData = { ...newProject };
        } else {
            thisData = [...data];
        }
        if (index === -1) {
            for (let x in thisData) {
                if (x === "projectImage" || x[0] === "_") continue;
                form.append(x, newProject[x]);
            }
            await axios.post("/api/project/", form, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });
            setNewProject({ ...ProjectSchema });
        } else {
            for (let x in thisData[index]) {
                if (x === "projectImage" || x[0] === "_")   continue;
                form.append(x, thisData[index][x]);
            }
            form.append("id", thisData[index]._id);
            await axios.put("/api/project/", form, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });
        }
        setshouldUpdate(prev => !prev);
    }

    const onClickDefaultButtonHandler = (index, type) => {
        let prevData;
        if (index === -1) {
            prevData = { ...newProject };
            prevData[type] = ProjectSchema[type];
            prevData.changed = checkValidation(index, prevData);
            setNewProject(prevData);
        } else {
            prevData = [...data];
            prevData[index][type] = ProjectSchema[type];
            prevData[index].changed = checkValidation(index, prevData[index]);
            setdata(prevData);
        }
    }

    const onChangeFileHandler = (e, index) => {
        let thisData;
        if (index === -1) {
            thisData = { ...newProject };
        } else {
            thisData = [...data];
        }
        if (index === -1) {
            thisData.image = e.target.files[0];
            setNewProject(thisData);
        } else {
            thisData[index].image = e.target.files[0];
            setdata(thisData);
        }
    }

    const onFinalDeleteHandler = async (e,index) => {
        e.currentTarget.classList.add("loading");
        await axios.delete("/api/project/", {
            data: {
                id: data[index]._id
            }
        });
        setshouldUpdate(prevData => !prevData);
    }
    return (
        <Tab.Pane loading={loading}>
            <Accordion styled fluid>
                {
                    data.map((project, index) => (
                        <React.Fragment key={index}>
                            <Accordion.Title active={activeIndex === index} onClick={(event) => accordionClickHandler(event, index)}>
                                <Icon name='dropdown' />
                                {project.heading}
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === index}>
                                <ProjectComponent Project={project} ProjectIndex={index} onChangeHandler={onChangeHandler} onFinalSubmitButton={onFinalSubmitButton} onClickDefaultButtonHandler={onClickDefaultButtonHandler} onChangeFileHandler={onChangeFileHandler} onFinalDeleteHandler={onFinalDeleteHandler}/>
                            </Accordion.Content>
                        </React.Fragment>
                    ))
                }
            </Accordion>
            <br />
            <Form style={{ margin: '1%' }}>
                <Form.Field>
                    <h3>Fill Project Details</h3>
                </Form.Field>
                <ProjectComponent Project={newProject} ProjectIndex={-1} onChangeHandler={onChangeHandler} onFinalSubmitButton={onFinalSubmitButton} onClickDefaultButtonHandler={onClickDefaultButtonHandler} onChangeFileHandler={onChangeFileHandler} onFinalDeleteHandler={onFinalDeleteHandler}/>
            </Form>
        </Tab.Pane>
    )
}

export default Project
