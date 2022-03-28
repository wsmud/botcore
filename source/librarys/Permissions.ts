import { Permissions } from '../types/Permissions';

export default <Permissions>{
  /** root用户 */
  ROOT: 2 ** 2,
  /** 管理员用户 */
  ADMIN: 2 ** 1,
  /** 普通用户 */
  USER: 2 ** 0,
};
