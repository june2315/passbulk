import { invoke } from '@tauri-apps/api/tauri';
import { writeText } from '@tauri-apps/api/clipboard';

export async function getRandomPassword() {
    return invoke('gen_password');
}

export async function getPasswordEntropy(data: any) {
    return invoke('password_entropy', data);
}

export async function queryPasswordList(query_params: any = {}) {
    return invoke('query', { data: JSON.stringify(query_params) });
}

export async function savePassword(values: any) {
    return invoke('save', { data: JSON.stringify(values) }).catch(
        (err: any) => {
            console.log(err);
            return Promise.reject(err);
        }
    );
}

export async function deletePasswords(ids: string) {
    return invoke('batch_delete', { ids });
}

export async function decryptPassword(id: string) {
    return invoke('decrypt_password', { id });
}

export async function copyPassword(id: any, storePwd: string) {
    if (!window.__TAURI__) return Promise.reject();
    if (storePwd) {
        return writeText(storePwd);
    } else {
        return decryptPassword(id.toString()).then((password: any) =>
            writeText(password)
        );
    }
}
