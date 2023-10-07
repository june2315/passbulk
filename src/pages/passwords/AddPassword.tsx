import Modal from '../../components/Modal';
import Input from '../../components/Input';
import TextArea from '../../components/TextArea';
import FormItem from '../../components/FormItem';
import Button from '../../components/Button';
import { tuning, randomIcon, eyeIcon, eyeOff } from '../../components/Icons';
import { useSetState } from 'ahooks';

export default function AddPassword(props: any) {
    const { open, onClose } = props;
    const [state, setState] = useSetState({
        passwordVisible: false,
    });

    const togglePasswordVisible = () => {
        setState({ passwordVisible: !state.passwordVisible });
    };
    return (
        <Modal
            title="Create a password"
            open={open}
            onClose={onClose}
            okText="Create"
        >
            <form>
                <FormItem label="Name" name="name" required>
                    <Input placeholder="Name" id="name" />
                </FormItem>

                <FormItem label="URI" name="URI">
                    <Input placeholder="URI" id="URI" />
                </FormItem>

                <FormItem label="Username" name="username">
                    <Input placeholder="Username" id="username" />
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
                    />
                </FormItem>
            </form>
        </Modal>
    );
}
