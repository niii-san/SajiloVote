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
    BelongsTo,
    HasOne,
} from "@sequelize/core/decorators-legacy";
import { Event } from "./event.model.js";

/*
 * Votes candidate table
 * This is table for candidates options in Event type "vote"
 */

@Table({ underscored: true, tableName: "vote_candidates", timestamps: false })
export class VoteCandidate extends Model<
    InferAttributes<VoteCandidate>,
    InferCreationAttributes<VoteCandidate>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare vote_candidate_id: CreationOptional<number>;

    // foreign key, belgons to which event
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare event_id: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare candidate_name: string;

    @Attribute(DataTypes.STRING)
    declare candidate_email: CreationOptional<string | null>;

    @BelongsTo(() => Event, {
        foreignKey: {
            name: "event_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    })
    declare event?: NonAttribute<Event>;
}

/*
 * poll_options table
 * This table is for poll options in Event type "poll"
 */

@Table({ underscored: true, tableName: "poll_options", timestamps: false })
export class PollOption extends Model<
    InferAttributes<PollOption>,
    InferCreationAttributes<PollOption>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare poll_option_id: CreationOptional<number>;

    // foreign key, belgons to which event
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare event_id: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare option_text: string;

    @BelongsTo(() => Event, {
        foreignKey: {
            name: "event_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    })
    declare event?: NonAttribute<Event>;
}

/*
 * vote_records table
 * this table is for tracking votes,
 * who voted in which event for which option
 */

@Table({ underscored: true, tableName: "vote_records", timestamps: false })
export class VoteRecord extends Model<
    InferAttributes<VoteRecord>,
    InferCreationAttributes<VoteRecord>
> {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare record_id: CreationOptional<number>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare event_id: number;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare voter_id: number;

    @Attribute(DataTypes.STRING)
    declare voted_candidate_id: CreationOptional<string>;

    @Attribute(DataTypes.STRING)
    declare voted_option_id: CreationOptional<string>;

    @Attribute(DataTypes.DATE)
    @NotNull
    declare voted_at: Date;

    @BelongsTo(() => Event, {
        foreignKey: {
            name: "event_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    })
    declare event?: NonAttribute<Event>;
}

@Table({ tableName: "event_participants", underscored: true })
export class EventParticipant extends Model<
    InferAttributes<EventParticipant>,
    InferCreationAttributes<EventParticipant>
> {
    // which user participated
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare user_id: number;

    // foreign key, which user participated in which event
    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare event_id: number;

    @BelongsTo(() => Event, {
        foreignKey: {
            name: "event_id",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
    })
    declare event?: NonAttribute<Event>;
}
