import { JoinColumn, OneToOne, ViewColumn, ViewEntity } from 'typeorm';
import { Role } from '../entities/role.entity';

@ViewEntity({
  name: 'summary_roles',
  expression: `
    SELECT
      roles.id role_id,
      COALESCE ( users.total_user, 0 ) total_user 
    FROM
      roles
    LEFT JOIN ( 
      SELECT 
        users.role_id, 
        COUNT (users.id) AS total_user 
      FROM
        users
      WHERE
        users.deleted_at IS NULL
      GROUP BY
        users.role_id 
    ) users ON users.role_id = roles.id`,
})
export class SummaryRoleView {
  @ViewColumn()
  role_id: string;

  @ViewColumn()
  total_user: number;

  @OneToOne(() => Role, (object) => object.summary)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
