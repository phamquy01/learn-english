import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTables1751603944256 implements MigrationInterface {
    name = 'AddTables1751603944256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "word" ("id" SERIAL NOT NULL, "word" character varying NOT NULL, "type" character varying NOT NULL, "pronounce" character varying NOT NULL, "meaning" character varying NOT NULL, CONSTRAINT "PK_ad026d65e30f80b7056ca31f666" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying, "image" character varying, "address" character varying, "role" character varying NOT NULL DEFAULT 'USER', "accountType" character varying NOT NULL DEFAULT 'LOCAL', "isActive" boolean NOT NULL DEFAULT false, "codeId" character varying, "codeExpired" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "translation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fromText" character varying NOT NULL, "from" character varying NOT NULL, "toText" character varying NOT NULL, "to" character varying NOT NULL, "save" boolean NOT NULL DEFAULT false, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_7aef875e43ab80d34a0cdd39c70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "translation" ADD CONSTRAINT "FK_b98035ff78e3fc170af5ad64fe5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "translation" DROP CONSTRAINT "FK_b98035ff78e3fc170af5ad64fe5"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`DROP TABLE "translation"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TABLE "word"`);
    }

}
