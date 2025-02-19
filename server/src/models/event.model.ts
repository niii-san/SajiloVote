import {
    DataTypes,
    Model,
    InferAttributes,
    CreationOptional,
    InferCreationAttributes,
    NonAttribute,
} from "@sequelize/core";
import {
    Attribute,
    NotNull,
    PrimaryKey,
    AutoIncrement,
    Table,
    HasMany,
} from "@sequelize/core/decorators-legacy";
import { PollOption, VoteCandidate, VoteRecord } from "./votes.model.js";

@Table({ underscored: true })
export class Event extends Model<
    InferAttributes<Event>,
    InferCreationAttributes<Event>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare event_id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare title: string;

    @Attribute(DataTypes.TEXT)
    declare description: CreationOptional<string>;

    @Attribute(DataTypes.ENUM(["poll", "vote"]))
    @NotNull
    declare type: "poll" | "vote";

    @Attribute(DataTypes.DATE)
    declare start_at: Date | null;

    @Attribute(DataTypes.DATE)
    declare end_at: Date | null;

    @Attribute(DataTypes.ENUM(["immediate", "manual", "date"]))
    @NotNull
    declare start_type: "immediate" | "manual" | "date";

    // Foreign key
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare creator_id: number;

    // one event has many vote records, i.e which user voted to which poll_option/vote_candidate
    @HasMany(() => VoteRecord, "event_id")
    declare vote_records?: NonAttribute<VoteRecord[]>;

    // one event can have many candidates if the event type is "vote"
    @HasMany(() => VoteCandidate, "event_id")
    declare vote_candidates?: NonAttribute<VoteCandidate[]>;

    // one event can have many poll options if the event type is "poll"
    @HasMany(() => PollOption, "event_id")
    declare poll_options?: NonAttribute<PollOption[]>;
}
