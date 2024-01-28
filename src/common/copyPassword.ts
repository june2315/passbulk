import Message from '@/components/Message/Message';
import { copyPassword } from '@/api';
export default function triggerCopyPassword(id, value) {
  return copyPassword(id, value).then(() => {
    Message.success('已复制到剪切板');
  });
}
