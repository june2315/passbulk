import React, {
    cloneElement,
    ReactElement,
    forwardRef,
    useContext,
    PropsWithChildren,
    useState,
    useEffect,
    useMemo,
    ReactNode,
    useRef,
} from 'react';
import type { RefObject } from 'react';
import { CSSTransition } from 'react-transition-group';
import cs from '../../common/classNames';
import { isArray, isFunction, isUndefined, isObject } from '../../common/utils';
//   import Grid from '../Grid';
import {
    FormItemProps,
    FieldError,
    KeyType,
    FormContextProps,
    VALIDATE_STATUS,
    FormItemChildrenFn,
} from './interface';
import Control from './control';
import {
    FormItemContext as RawFormItemContext,
    FormItemContextType as RawFormItemContextType,
    FormContext,
    FormListContext,
} from './context';
// import { ConfigContext } from '../ConfigProvider';
import { omit } from '../../common/utils';
import FormItemLabel from './form-label';
import { formatValidateMsg } from './utils';

// const Row = Grid.Row;
// const Col = Grid.Col;

interface FormItemTipProps extends Pick<FormItemProps, 'prefixCls' | 'help'> {
    errors: FieldError[];
    warnings: ReactNode[];
}

// 错误提示文字
const FormItemTip: React.FC<FormItemTipProps> = ({
    prefixCls,
    help,
    errors: propsErrors,
    warnings,
}) => {
    const errorTip = propsErrors.map((item, i) => {
        if (item) {
            return (
                <div
                    key={i}
                    role="alert"
                    className="text-[rgb(245,63,63)] text-sm"
                >
                    {item.message}
                </div>
            );
        }
    });
    const warningTip: any[] = [];
    warnings.map((item, i) => {
        warningTip.push(
            <div
                key={i}
                role="alert"
                className={`${prefixCls}-message-help-warning`}
            >
                {item}
            </div>
        );
    });
    const isHelpTip = !isUndefined(help) || !!warningTip.length;
    const visible = isHelpTip || !!errorTip.length;

    const tipsRef: RefObject<HTMLDivElement> = useRef(null);

    const TipElement: ReactElement = (
        <div
            ref={tipsRef}
            className={cs(`${prefixCls}-message`, {
                [`${prefixCls}-message-help`]: isHelpTip,
            })}
        >
            {!isUndefined(help) ? (
                help
            ) : (
                <>
                    {errorTip.length > 0 && errorTip}
                    {warningTip.length > 0 && warningTip}
                </>
            )}
        </div>
    );
    return (
        visible && (
            <CSSTransition
                in={visible}
                appear
                classNames="formblink"
                timeout={300}
                unmountOnExit
                nodeRef={tipsRef}
            >
                {TipElement as any}
            </CSSTransition>
        )
    );
};

const Item = <
    FormData extends object = any,
    FieldValue = FormData[keyof FormData],
    FieldKey extends KeyType = keyof FormData
>(
    props: PropsWithChildren<FormItemProps<FormData, FieldValue, FieldKey>>,
    ref: React.Ref<any>
) => {
    // const { getPrefixCls, prefixCls: prefix } = useContext(ConfigContext);
    const prefix = props.prefix;
    const topFormContext = useContext(RawFormItemContext);
    const formListContext = useContext(FormListContext);
    const [errors, setErrors] = useState<{
        [key: string]: FieldError<FieldValue>;
    }>(null);
    const [warnings, setWarnings] = useState<{
        [key: string]: ReactNode[];
    }>(null);
    const formContext = useContext(FormContext);
    const prefixCls = formContext.prefixCls || 'passbulk-form';
    const formLayout = props.layout || formContext.layout || 'horizontal';
    const labelAlign = props.labelAlign || formContext.labelAlign;
    const isDestroyed = useRef(false);

    // console.log('formLayout', formLayout);

    // update error status
    const updateInnerFormItem = (
        field: string,
        params: {
            errors?: FieldError<FieldValue>;
            warnings?: ReactNode[];
        } = {}
    ) => {
        if (isDestroyed.current) {
            return;
        }
        const { errors, warnings } = params || {};

        setErrors((innerErrors) => {
            const newErrors = { ...(innerErrors || {}) };
            if (errors) {
                newErrors[field] = errors;
            } else {
                delete newErrors[field];
            }
            return newErrors;
        });

        setWarnings((current) => {
            const newVal = { ...(current || {}) };
            if (warnings && warnings.length) {
                newVal[field] = warnings;
            } else {
                delete newVal[field];
            }
            return newVal;
        });
    };

    const updateFormItem =
        isObject(props.noStyle) &&
        props.noStyle.showErrorTip &&
        topFormContext.updateFormItem
            ? topFormContext.updateFormItem
            : updateInnerFormItem;

    useEffect(() => {
        isDestroyed.current = false;

        return () => {
            isDestroyed.current = true;
            setErrors(null);
            setWarnings(null);
        };
    }, []);

    const contextProps = {
        ...(formContext as React.Context<
            FormContextProps<FormData, FieldValue, FieldKey>
        >),
        validateMessages:
            formContext['formatValidateMsg']  &&
            formatValidateMsg(formContext['formatValidateMsg'], {
                label: props.label,
            }),
        prefixCls,
        updateFormItem,
        disabled: 'disabled' in props ? props.disabled : formContext.disabled,
    };

    const { label, extra, className, style, validateStatus, hidden, ...rest } =
        props;
    const labelClassNames = cs(`${prefixCls}-label-item`, {
        [`${prefixCls}-label-item-left`]: labelAlign === 'left',
    });

    const errorInfo = errors ? Object.values(errors) : [];
    const warningInfo = warnings
        ? Object.values(warnings).reduce(
              (total, next) => total.concat(next),
              []
          )
        : [];

    const itemStatus = useMemo(() => {
        if (validateStatus) {
            return validateStatus;
        }
        if (errorInfo.length) {
            return VALIDATE_STATUS.error;
        }
        if (warningInfo.length) {
            return VALIDATE_STATUS.warning;
        }
        return undefined;
    }, [errors, warnings, validateStatus]);

    const hasHelp = useMemo(() => {
        return !isUndefined(props.help) || warningInfo.length > 0;
    }, [props.help, warnings]);

    const classNames = cs(
        `${prefixCls}-item`,
        {
            [`${prefixCls}-item-error`]:
                hasHelp ||
                (!validateStatus && itemStatus === VALIDATE_STATUS.error),
            [`${prefixCls}-item-status-${itemStatus}`]: itemStatus,
            [`${prefixCls}-item-has-help`]: hasHelp,
            [`${prefixCls}-item-hidden`]: hidden,
            [`${prefixCls}-item-has-feedback`]: itemStatus && props.hasFeedback,
            ['hidden']: hidden,
            ['flex space-x-3 ']: formLayout === 'horizontal',
            ['mb-[20px]']: !itemStatus,
        },
        `${formLayout}`,
        `${prefixCls}-layout-${formLayout}`,
        'group/form',
        className
    );

    const cloneElementWithDisabled = () => {
        const { field, children } = props;
        const disabled =
            'disabled' in props ? props.disabled : formContext.disabled;

        if (isFunction(children)) {
            return (
                <Control
                    disabled={disabled}
                    {...(props as any)}
                    {...(field ? { key: field, _key: field } : {})}
                >
                    {(...rest) =>
                        children(
                            ...(rest as Parameters<
                                FormItemChildrenFn<
                                    FormData,
                                    FieldValue,
                                    FieldKey
                                >
                            >)
                        )
                    }
                </Control>
            );
        }

        if (isArray(children)) {
            const childrenDom = React.Children.map(children, (child, i) => {
                const key =
                    (isObject(child) && (child as ReactElement).key) || i;
                const existChildDisabled =
                    isObject(child) &&
                    'disabled' in (child as ReactElement).props;
                const childProps =
                    !isUndefined(disabled) && !existChildDisabled
                        ? { key, disabled }
                        : { key };
                return isObject(child)
                    ? cloneElement(child as ReactElement, childProps)
                    : child;
            });
            return (
                <Control {...(props as any)} field={undefined}>
                    {childrenDom}
                </Control>
            );
        }
        if (React.Children.count(children) === 1) {
            if (field) {
                const key = formListContext?.getItemKey?.(field) || field;
                return (
                    <Control
                        disabled={disabled}
                        {...(props as any)}
                        key={key}
                        _key={key}
                    >
                        {children}
                    </Control>
                );
            }
            if (isObject(children)) {
                // Compatible Form.Control
                if ((children as any).type?.isFormControl) {
                    return children;
                }
                const existChildDisabled =
                    'disabled' in (children as ReactElement).props;
                const childProps =
                    !existChildDisabled && !isUndefined(disabled)
                        ? { disabled }
                        : null;

                return (
                    <Control {...(props as any)} field={undefined}>
                        {!childProps
                            ? children
                            : cloneElement(
                                  children as ReactElement,
                                  childProps
                              )}
                    </Control>
                );
            }
        }

        return children;
    };

    const FormItemContext =
        RawFormItemContext as unknown as RawFormItemContextType<
            FormData,
            FieldValue,
            FieldKey
        >;

    const newFormContext = {
        ...formContext,
    };

    // if (!props.noStyle) {
    //     newFormContext.wrapperCol = undefined;
    //     newFormContext.labelCol = undefined;
    // }

    return (
        <FormContext.Provider value={newFormContext}>
            <FormItemContext.Provider value={contextProps}>
                {props.noStyle ? (
                    cloneElementWithDisabled()
                ) : (
                    <div
                        ref={ref}
                        {...omit(rest, [
                            'tooltip',
                            'children',
                            'prefixCls',
                            'store',
                            'initialValue',
                            'field',
                            'labelCol',
                            'wrapperCol',
                            'colon',
                            'disabled',
                            'rules',
                            'trigger',
                            'triggerPropName',
                            'validateTrigger',
                            'noStyle',
                            'required',
                            'hasFeedback',
                            'help',
                            'normalize',
                            'formatter',
                            'getValueFromEvent',
                            'shouldUpdate',
                            'field',
                            'isInner',
                            'labelAlign',
                            'layout',
                            'requiredSymbol',
                            'isFormList',
                        ])}
                        className={cs(classNames)}
                        // div={formLayout !== 'horizontal'}
                        style={style}
                    >
                        {label ? (
                            <div
                                // {...(props.labelCol || formContext.labelCol)}
                                className={cs(
                                    labelClassNames,
                                    'leading-[22px]',
                                    'group-[.vertical]/form:mb-[8px] group-[.vertical]/form:font-semibold',
                                    'group-[.flex]/form:text-right group-[.flex]/form:basis-5/24 group-[.flex]/form:leading-[38px]'
                                )}
                            >
                                <FormItemLabel
                                    // tooltip={props.tooltip}
                                    htmlFor={
                                        props.field &&
                                        formContext.getFormElementId(
                                            props.field
                                        )
                                    }
                                    label={label}
                                    prefix={prefix as string}
                                    requiredSymbol={
                                        'requiredSymbol' in props
                                            ? props.requiredSymbol
                                            : formContext.requiredSymbol
                                    }
                                    required={props.required}
                                    rules={props.rules}
                                    showColon={
                                        'colon' in props
                                            ? props.colon
                                            : formContext.colon
                                    }
                                />
                            </div>
                        ) : null}
                        <div
                            className={cs(
                                `${prefixCls}-item-wrapper`,
                                'flex-1'
                            )}
                            // {...(props.wrapperCol || formContext.wrapperCol)}
                        >
                            {cloneElementWithDisabled()}
                            <FormItemTip
                                prefixCls={prefixCls}
                                help={props.help}
                                errors={errorInfo}
                                warnings={warningInfo}
                            />
                            {extra && (
                                <div className={`${prefixCls}-extra`}>
                                    {extra}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </FormItemContext.Provider>
        </FormContext.Provider>
    );
};

const ItemComponent = forwardRef(Item);

ItemComponent.defaultProps = {
    trigger: 'onChange',
    triggerPropName: 'value',
};

ItemComponent.displayName = 'FormItem';

export default ItemComponent as <
    FormData extends object = any,
    FieldValue = FormData[keyof FormData],
    FieldKey extends KeyType = keyof FormData
>(
    props: FormItemProps<FormData, FieldValue, FieldKey> & {
        ref?: React.Ref<any>;
    }
) => React.ReactElement;
