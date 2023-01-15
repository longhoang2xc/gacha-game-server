import { dayjs } from "@app/helpers";
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
export abstract class DefaultEntity {
  @PrimaryGeneratedColumn("uuid", {
    name: "Id",
  })
  id!: string;

  @Column({
    name: "IsDelete",
    type: "bool",
    default: false,
  })
  isDelete!: boolean;

  @Column({
    nullable: true,
    type: "uuid",
    name: "CreatedBy",
  })
  createdBy!: string;

  @CreateDateColumn({
    nullable: false,
    type: "timestamp",
    name: "CreatedDate",
  })
  createdDate!: Date;

  @Column({
    nullable: true,
    type: "timestamp",
    name: "CreatedDateVnTime",
  })
  createdDateVnTime!: Date | string;

  @Column({
    nullable: true,
    type: "uuid",
    name: "ModifiedBy",
  })
  modifiedBy!: string;

  @UpdateDateColumn({
    nullable: true,
    type: "timestamp",
    name: "ModifiedDate",
  })
  modifiedDate!: Date;

  @Column({
    nullable: true,
    type: "timestamp",
    name: "ModifiedDateVnTime",
  })
  modifiedDateVnTime!: Date | string;

  @BeforeInsert()
  addCreationInfo() {
    this.createdDateVnTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  }

  @BeforeUpdate()
  addModificationInfo() {
    this.modifiedDateVnTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  }
}
