import { useRef } from 'react';

class FormStore {
    store: any;
    constructor() {
        this.store = {};
    }

    getFieldValue = (name: string) => {
        return this.store[name];
    };
    getFieldsValue = () => {
        return { ...this.store };
    };

    setFieldsValue = (newStore: any) => {
        this.store = {
            ...this.store,
            ...newStore,
        };
    };

    submit = () => {
        console.log('submit');
    };

    getForm = () => {
        return {
            getFieldsValue: this.getFieldsValue,
            getFieldValue: this.getFieldValue,
            setFieldsValue: this.setFieldsValue,
            submit: this.submit,
        };
    };
}

export default function useForm() {
    const formRef: any = useRef();

    if (!formRef.current) {
        const formStore = new FormStore();
        formRef.current = formStore.getForm();
    }
    return [formRef.current];
}
