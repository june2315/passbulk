import Modal from '@/components/Modal';
import Input from '@/components/Input';
import TextArea from '@/components/TextArea';
// import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import Button from '@/components/Button';
import { tuning, randomIcon, eyeIcon, eyeOff } from '@/components/Icons';
import { getRandomPassword, getPasswordEntropy } from '@/api';
import { useSetState } from 'ahooks';
import { useEffect } from 'react';
import classNames from 'classnames';

const FormItem = Form.Item;

export default function AddPassword(props: any) {
    const { open, onClose, onOk, data } = props;

    const [form] = Form.useForm();

    const [state, setState]: any = useSetState({
        passwordVisible: false,
        okLoading: false,
        pwdEntropy: 0,
    });

    useEffect(() => {
        if (open) {
            if (data) {
                // console.log('data', data);
                form.setFieldsValue(data);
                calcPwdEntropy(data.password);
            } else {
                form.resetFields();
                setState({ pwdEntropy: 0 });
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

    const calcPwdEntropy = (value) => {
        getPasswordEntropy({ password: value }).then((entropy) => {
            setState({
                pwdEntropy: entropy
                    ? parseFloat(entropy as string).toFixed(2)
                    : 0.0,
            });
        });
    };

    const handlePasswordChange = (value) => {
        calcPwdEntropy(value);
    };

    const handleRandomPassword = () => {
        getRandomPassword().then((password) => {
            form.setFieldsValue({ password });
            getPasswordEntropy({
                // password: "EDH2#XB{'@YfJ[C*mN"
                // password: "6$p@K:%oi{<\]y*Szd"
                password,
            }).then((entropy) => {
                // console.log('random password', password, entropy);
                setState({
                    pwdEntropy: parseFloat(entropy as string).toFixed(2),
                });
            });
        });
        // console.log(window.crypto.getRandomValues());
    };

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

    const getPasswordLevel = (entropy) => {
        if (entropy < 50) {
            return 'Very weak';
        } else if (entropy < 80) {
            return 'Weak';
        } else if (entropy < 105) {
            return 'Fair';
        } else if (entropy <= 130) {
            return 'Strong';
        } else {
            return 'Very strong';
        }
    };

    const getEntropyColor = (entropy) => {
        let color = 'from-[#a40000] via-[#ffa724] to-[#0eaa00]';
        if (!!entropy) {
            if (entropy < 20) {
                color = 'from-[#a40000] from-5% to-5%';
            } else if (entropy < 50) {
                color = 'from-[#C03C0D] from-15% to-15%';
            } else if (entropy < 65) {
                color = 'from-[#E17319] from-30% to-30%';
            } else if (entropy < 80) {
                color = 'from-[#F1A820] from-45% to-45%';
            } else if (entropy < 95) {
                color = 'from-[#D6A91F] from-60% to-60%';
            } else if (entropy < 105) {
                color = 'from-[#8AA917] from-75% to-75%';
            } else if (entropy < 115) {
                color = 'from-[#4EA90F] from-85% to-85%';
            } else if (entropy < 135) {
                color = 'from-[#4EA90F] from-90% to-90%';
            } else if (entropy < 186) {
                color = 'from-[#4EA90F] from-95% to-95%';
            } else {
                // const num = Math.round(85 + (entropy / 300) * 15);
                // console.log(num);
                // color = 'from-[#0eaa00] from-[' + num + '%] to-[' + num + '%]';
                color = 'from-[#4EA90F] from-100% to-100%';
            }
        }
        return color;
    };
    return (
        <Modal
            title="Create a password"
            open={open}
            onClose={onClose}
            onOk={handleOk}
            okText={data?.id ? 'Modify' : 'Create'}
            okButtonProps={{ loading: state.okLoading }}
        >
            <Form
                layout="vertical"
                requiredSymbol={{ position: 'end' }}
                form={form}
            >
                <FormItem field="id" hidden>
                    <Input />
                </FormItem>
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

                <FormItem label="URI" field="uri">
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
                                className="cursor-pointer relative top-[0px] px-[3px] pr-[4px] bg-black"
                                onClick={togglePasswordVisible}
                            >
                                {state.passwordVisible ? eyeIcon : eyeOff}
                            </div>
                        }
                        extra={{
                            right: [
                                <Button
                                    key="random"
                                    icon={randomIcon}
                                    className="h-[38px] pt-[6px]"
                                    onClick={handleRandomPassword}
                                />,
                                <Button key="tuning" icon={tuning} />,
                            ],
                            bottom: [
                                <div
                                    key="intensity"
                                    className="mt-[6px] mb-[0px]"
                                >
                                    <span className="text-sm font-light">
                                        <span>
                                            {state.pwdEntropy
                                                ? getPasswordLevel(
                                                      parseFloat(
                                                          state.pwdEntropy
                                                      )
                                                  )
                                                : 'Quality'}
                                        </span>
                                        {state.pwdEntropy
                                            ? ` (entropy: ${state.pwdEntropy} bits) `
                                            : ''}
                                    </span>
                                    <div
                                        className={classNames(
                                            'h-[2px] bg-gradient-to-r ',
                                            getEntropyColor(
                                                parseFloat(state.pwdEntropy)
                                            )
                                        )}
                                    ></div>
                                </div>,
                            ],
                        }}
                        onChange={(value) => handlePasswordChange(value)}
                    />
                </FormItem>

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
