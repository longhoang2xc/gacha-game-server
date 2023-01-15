import { Entity, Column } from "typeorm";
import { DefaultEntity } from "./";
@Entity({ name: "Test" })
export class TestEntity extends DefaultEntity {
  // @PrimaryGeneratedColumn("uuid", {
  //     name: 'Id'
  // })
  // id: string
  // constructor() {
  //   super();
  // }

  @Column({
    nullable: true,
    name: "FirstName",
    type: "varchar",
    length: 128,
  })
  firstName!: string;

  @Column({
    nullable: true,
    name: "LastName",
    type: "varchar",
    length: 128,
  })
  lastName!: string;

  @Column({
    nullable: true,
    name: "Age",
    type: "int",
  })
  age!: number;
}
