import Modal from '../../components/Modal';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
// import FormItem from '../../components/FormItem';
import Form from '../../components/Form';
import Button from '../../components/Button';
import { tuning, randomIcon, eyeIcon, eyeOff } from '../../components/Icons';
import { useSetState } from 'ahooks';
import { useEffect } from 'react';

const FormItem = Form.Item;

export default function AddPassword(props: any) {
    const { open, onClose, onOk, data } = props;

    const [form] = Form.useForm();

    const [state, setState]: any = useSetState({
        passwordVisible: false,
        okLoading: false,
    });

    useEffect(() => {
        if (open) {
            if (data) {
                form.setFieldsValue(data);
            } else {
                form.resetFields();
            }
        }
    }, [open]);

    const togglePasswordVisible = () => {
        setState({ passwordVisible: !state.passwordVisible });
    };

    // const handleChange = (key: string, value: any) => {
    //     state.values[key] = value;

    //     setState({ values: state.values });
    // };

    const handleOk = () => {
        form.validate()
            .then((values) => {
                const res = onOk?.(values);
                if (res instanceof Promise) {
                    setState({ okLoading: true });
                    res.then(onClose).finally(() =>
                        setState({ okLoading: false })
                    );
                } else {
                    onClose?.();
                }
            })
            .catch((err) => {
                console.log('err', err);
            });
    };

    return (
        <Modal
            title="Create a password"
            open={open}
            onClose={onClose}
            onOk={handleOk}
            okText="Create"
            okButtonProps={{ loading: state.okLoading }}
        >
            <Form
                layout="vertical"
                requiredSymbol={{ position: 'end' }}
                form={form}
            >
                <FormItem
                    label="Name"
                    field="name"
                    required
                    rules={[{ required: true }]}
                >
                    <Input
                        placeholder="Name"
                        // onChange={(event: any) =>
                        //     handleChange('name', event?.target.value)
                        // }
                    />
                </FormItem>

                <FormItem label="URI" field="URI">
                    <Input
                        placeholder="URI"
                        // onChange={(event: any) =>
                        //     handleChange('uri', event?.target.value)
                        // }
                    />
                </FormItem>

                <FormItem label="Username" field="username">
                    <Input
                        placeholder="Username"
                        // onChange={(event: any) =>
                        //     handleChange('username', event?.target.value)
                        // }
                    />
                </FormItem>

                <FormItem
                    label="Password"
                    field="password"
                    required
                    rules={[{ required: true }]}
                >
                    <Input
                        placeholder="Password"
                        type={state.passwordVisible ? 'text' : 'password'}
                        addonAfter={
                            <div
                                className="cursor-pointer relative top-[-2px]"
                                onClick={togglePasswordVisible}
                            >
                                {state.passwordVisible ? eyeIcon : eyeOff}
                            </div>
                        }
                        extraRight={[
                            <Button
                                key="random"
                                icon={randomIcon}
                                className="h-[38px] pt-[6px]"
                            />,
                            <Button key="tuning" icon={tuning} />,
                        ]}
                        // onChange={(event: any) =>
                        //     handleChange('password', event?.target.value)
                        // }
                    />
                </FormItem>

                <div className="mb-[20px]">
                    <span className="text-sm font-light">Quality</span>
                    <div className="h-[2px] bg-gradient-to-r from-[#a40000] via-[#ffa724] to-[#0eaa00]"></div>
                </div>

                <FormItem label="Description" field="description">
                    <TextArea
                        placeholder="Add a description"
                        // onChange={(event: any) =>
                        //     handleChange('description', event?.target.value)
                        // }
                    />
                </FormItem>
            </Form>
        </Modal>
    );
}
