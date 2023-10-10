import Modal from '../../components/Modal';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import FormItem from '../../components/FormItem';
import Form from '../../components/Form';
import Button from '../../components/Button';
import { tuning, randomIcon, eyeIcon, eyeOff } from '../../components/Icons';
import { useSetState } from 'ahooks';
import { useEffect } from 'react';

export default function AddPassword(props: any) {
    const { open, onClose, onOk } = props;

    const [state, setState]: any = useSetState({
        passwordVisible: false,
        okLoading: false,
        values: {},
    });

    useEffect(() => {
        if (open) {
            setState({ values: {} });
        }
    }, [open]);

    const togglePasswordVisible = () => {
        setState({ passwordVisible: !state.passwordVisible });
    };

    const handleChange = (key: string, value: any) => {
        state.values[key] = value;

        setState({ values: state.values });
    };

    const handleOk = () => {
        const res = onOk?.(state.values);
        if (res instanceof Promise) {
            setState({ okLoading: true });
            res.then(onClose).finally(() => setState({ okLoading: false }));
        } else {
            onClose?.();
        }
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
            <Form>
                <FormItem label="Name" name="name" required>
                    <Input
                        placeholder="Name"
                        id="name"
                        onChange={(event: any) =>
                            handleChange('name', event?.target.value)
                        }
                    />
                </FormItem>

                <FormItem label="URI" name="URI">
                    <Input
                        placeholder="URI"
                        id="URI"
                        onChange={(event: any) =>
                            handleChange('uri', event?.target.value)
                        }
                    />
                </FormItem>

                <FormItem label="Username" name="username">
                    <Input
                        placeholder="Username"
                        id="username"
                        onChange={(event: any) =>
                            handleChange('username', event?.target.value)
                        }
                    />
                </FormItem>

                <FormItem label="Password" name="password" required>
                    <Input
                        placeholder="Password"
                        id="password"
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
                            <Button key="random" icon={randomIcon} />,
                            <Button key="tuning" icon={tuning} />,
                        ]}
                        onChange={(event: any) =>
                            handleChange('password', event?.target.value)
                        }
                    />
                </FormItem>

                <div className="mb-[16px] mt-[-3px]">
                    <span className="text-sm font-light">Quality</span>
                    <div className="h-[2px] bg-gradient-to-r from-[#a40000] via-[#ffa724] to-[#0eaa00]"></div>
                </div>

                <FormItem label="Description" name="description">
                    <TextArea
                        placeholder="Add a description"
                        id="description"
                        onChange={(event: any) =>
                            handleChange('description', event?.target.value)
                        }
                    />
                </FormItem>
            </Form>
        </Modal>
    );
}
