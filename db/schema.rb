# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2023_06_26_123810) do

  create_table "contents", force: :cascade do |t|
    t.integer "api_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "position"
    t.string "contentable_type"
    t.integer "contentable_id"
    t.integer "inventory_id"
    t.integer "tier_id"
    t.string "name"
    t.string "image_url"
    t.index ["contentable_type", "contentable_id"], name: "index_contents_on_contentable"
    t.index ["inventory_id"], name: "index_contents_on_inventory_id"
    t.index ["tier_id"], name: "index_contents_on_tier_id"
  end

  create_table "contents_inventories", id: false, force: :cascade do |t|
    t.integer "content_id", null: false
    t.integer "inventory_id", null: false
    t.index ["content_id", "inventory_id"], name: "index_contents_inventories_on_content_id_and_inventory_id"
  end

  create_table "contents_tiers", id: false, force: :cascade do |t|
    t.integer "content_id", null: false
    t.integer "tier_id", null: false
    t.index ["content_id", "tier_id"], name: "index_contents_tiers_on_content_id_and_tier_id"
  end

  create_table "inventories", force: :cascade do |t|
    t.integer "tier_list_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["tier_list_id"], name: "index_inventories_on_tier_list_id"
  end

  create_table "template_tier_lists", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.integer "source"
    t.integer "content_type"
    t.integer "user_id", null: false
    t.integer "upvotes"
    t.integer "downvotes"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_template_tier_lists_on_user_id"
  end

  create_table "tier_lists", force: :cascade do |t|
    t.string "title", default: ""
    t.text "description", default: ""
    t.integer "source", default: 0
    t.integer "content_type", default: 0
    t.integer "user_id", null: false
    t.integer "upvotes", default: 0
    t.integer "downvotes", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "posted"
    t.index ["user_id"], name: "index_tier_lists_on_user_id"
  end

  create_table "tiers", force: :cascade do |t|
    t.string "rank"
    t.integer "tier_list_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["tier_list_id"], name: "index_tiers_on_tier_list_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "password_digest"
    t.text "bio"
    t.string "mal_url"
    t.string "anilist_url"
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "votes", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "tier_list_id", null: false
    t.boolean "upvoted"
    t.boolean "downvoted"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["tier_list_id"], name: "index_votes_on_tier_list_id"
    t.index ["user_id"], name: "index_votes_on_user_id"
  end

  add_foreign_key "contents", "inventories"
  add_foreign_key "contents", "tiers"
  add_foreign_key "inventories", "tier_lists"
  add_foreign_key "template_tier_lists", "users"
  add_foreign_key "tier_lists", "users"
  add_foreign_key "tiers", "tier_lists"
  add_foreign_key "votes", "tier_lists"
  add_foreign_key "votes", "users"
end
