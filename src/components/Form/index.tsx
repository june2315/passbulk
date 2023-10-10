import useForm from './useForm';
import FormContext from './formContext';

export default function Form({ onFinish, children }: any) {
    const [formInstance] = useForm();

    // formInstance.setCallbacks({
    //     onFinish,
    // });

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                // 这个submit就是我们写的那个submit，只是包装了一层，把form收集到的values传给我们了
                formInstance.submit();
            }}
        >
            <FormContext.Provider value={formInstance}>
                {children}
            </FormContext.Provider>
        </form>
    );
}
