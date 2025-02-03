import {
    DataTypes,
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional
} from "@sequelize/core";
import {
    Attribute,
    NotNull,
    PrimaryKey,
    AutoIncrement,
    Default,
} from "@sequelize/core/decorators-legacy";

export class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare first_name: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare last_name: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare email: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare password: string;

    @Attribute(DataTypes.STRING)
    declare refresh_token: CreationOptional<string>;

    @Attribute(DataTypes.DATE)
    @Default(DataTypes.NOW)
    declare created_at: CreationOptional<Date>;
}
