import { Column, Entity } from "typeorm";

@Entity("config")
export class Config {
  @Column({ unique: true, primary: true })
  key?: string;

  @Column()
  value?: string;
}
