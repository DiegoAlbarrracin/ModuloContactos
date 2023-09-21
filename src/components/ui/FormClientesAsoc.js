import React, { useState } from "react";
import {
    Button,
    Form,
    Select,
} from "antd";
import {
    PlusOutlined,
    CloseOutlined,
    SaveOutlined
} from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import './FormClientesAsoc.css';
import { useForm } from "antd/es/form/Form";


function FormClientesAsoc({idContacto, fetchDataClientesAsoc}) {

    const URL = process.env.REACT_APP_URL;
    const idUserLogged = localStorage.getItem("usuario");
    const [form] = Form.useForm();

    const [showInputs, setShowInputs] = useState(false);
    const [dataClientes, setDataClientes] = useState([]);
    const [optionsRoles, setOptionsRoles] = useState([]);


    const fetchDataClientesxUser = async () => {
        const dataForm = new FormData();
        dataForm.append("idU", idUserLogged);

        const requestOptions = {
            method: 'POST',
            body: dataForm
        };
        const data = await fetch(`${URL}selectClientesxUser.php`, requestOptions);
        const jsonData = await data.json();
        setDataClientes(jsonData);
    }

    const fetchRoles = async () => {

        const data = await fetch(`${URL}con_roles.php`);
        const jsonData = await data.json();

        const optionsRoles = jsonData.map((rol) => ({
            value: rol.rol_id,
            label: rol.rol_desc
        }));
        setOptionsRoles(optionsRoles);

    };

    const optionsCliente = dataClientes.map((cliente) => ({
        value: cliente.cli_id,
        label: cliente.cli_nombre,
    }));

    const onClickAgregar = () => {
        fetchDataClientesxUser();
        fetchRoles();
        setShowInputs(!showInputs);
    };

    //Funcion que crea una nueva relacion entre este contacto y un Cliente
    const crearRelacion = async (values) => {
        console.log('Intentando guardar')

        const data = new FormData();
        data.append("idCon", idContacto);
        data.append("idCli", values.idCliente);
        data.append("idRol", values.idRol);

        const requestOptions = {
            method: 'POST',
            body: data
        };
        const response = await fetch(`${URL}clientView_vincularContacto.php`, requestOptions);
        console.log(response);

        fetchDataClientesAsoc(idContacto);
        setShowInputs(!showInputs)
        form.resetFields();

    };


    return (
        <>
            <Form
                layout="vertical"
                form={form}
                onFinish={crearRelacion}
                autoComplete="off"
            >
                <div className={showInputs ? "btn-contenedor-modal": "btn-contenedor-modal-hideSelects"}> 
                    {showInputs && <div className="contenedor-inputs-formClientesAsoc">

                        <FormItem style={{ width: '200px' }} name="idCliente"
                            hasFeedback
                            rules={[{
                                required: true,
                                message: "Seleccione un cliente"
                            }]}>
                            <Select
                                showSearch
                                className='input-style'
                                placeholder="Selecciona un cliente"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input.toUpperCase().trim())}
                                options={[...optionsCliente]}
                                //onChange={handleChangeCliente}
                                name="idCliente"
                            />
                        </FormItem>

                        <FormItem style={{ width: '200px' }} name="idRol"
                            hasFeedback
                            rules={[{
                                required: true,
                                message: "Seleccione un rol"
                            }]}>
                            <Select
                                showSearch
                                className='input-style'
                                placeholder="Selecciona un rol"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                options={optionsRoles.length > 0 ? optionsRoles : ''}
                                //onChange={(e)=>setContacto(prev => ({ ...prev, idRol: e }))}
                                name="idRol"
                            />
                        </FormItem>
                        {showInputs && 
                            <Button
                            htmlType="submit"
                            className='btn-guardar-relacion'
                        >   <SaveOutlined type="primary" style={{ fontSize: "20px", marginTop: "1px" }} className="icon-color" />
                            </Button>}


                    </div>}

                    <div> 
                        {!showInputs ? <PlusOutlined type="primary" style={{ fontSize: "20px", marginRight: "15px" }} className="icon-color" onClick={onClickAgregar} /> :
                            <CloseOutlined type="primary" style={{ fontSize: "20px", marginRight: "15px" }} className="icon-color" onClick={() => setShowInputs(!showInputs)} />}

                    </div>
                </div>

            </Form>
        </>
    )
}

export default FormClientesAsoc