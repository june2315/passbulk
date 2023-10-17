import React, { ReactNode } from 'react';
import { FormProps } from './interface';
import { isFunction, isObject, isArray } from '../../common/utils';
import { cloneDeepWith, setWith, has } from 'lodash-es';
import { Schema, SchemaType } from 'b-validate';
import { RulesProps } from './interface';

export const formatValidateMsg = (
    validateMessages: FormProps['validateMessages'],
    info: { label: ReactNode }
) => {
    return cloneDeepWith(validateMessages, (val) => {
        if (isFunction(val)) {
            return (data) => {
                return val(data, info);
            };
        }
    });
};

export function iterativelyGetKeys(_obj, _prefix = '') {
    const processed = new Set();
    const getKeys = (obj, prefix = '') => {
        if (!obj) {
            return [];
        }
        // Avoid circular dependencies
        if (processed.has(obj)) {
            return [];
        }
        processed.add(obj);

        return Object.keys(obj).reduce((res, el) => {
            if (
                (isObject(obj[el]) || isArray(obj[el])) &&
                Object.keys(obj[el]).length &&
                !React.isValidElement(obj[el])
            ) {
                return [...res, ...getKeys(obj[el], `${prefix + el}.`)];
            }
            return [...res, prefix + el];
        }, []);
    };
    return getKeys(_obj, _prefix);
}

// 判断是否是个事件对象 e?.constructor?.name 可能不是 SyntheticEvent，跟业务项目的打包方式有关系
export function isSyntheticEvent(e: any): boolean {
    return (
        e?.constructor?.name === 'SyntheticEvent' ||
        e?.nativeEvent instanceof Event
    );
}

export async function schemaValidate(
    field,
    value,
    _rules: RulesProps[],
) {
    const rules: RulesProps[] = [..._rules];
    let current = 0;

    return new Promise(async (resolve) => {
        const warning = [];
        const validate = async (rule: RulesProps) => {
            const next = () => {
                if (current < rules.length - 1) {
                    current++;
                    return validate(rules[current]);
                }

                return resolve({ error: null, warning });
            };

            if (!rule) {
                return next();
            }

            const _rule = { ...rule };
            if (!_rule.type && !_rule.validator) {
                _rule.type = 'string';
            }
            const schema = new Schema({ [field]: [_rule] } as SchemaType, {
                ignoreEmptyString: true,
            });

            schema.validate({ [field]: value }, (error) => {
                if (error) {
                    if (rule.validateLevel === 'warning') {
                        warning.push(error[field].message);
                    } else {
                        return resolve({
                            error,
                            warning,
                        });
                    }
                }
                return next();
            });
        };
        validate(rules[current]);
    });
}

export function isFieldMatch(field, fields) {
    const fieldObj = setWith({}, field, undefined, Object);

    return fields.some((item) => has(fieldObj, item));
}

export const ID_SUFFIX = '_input';
