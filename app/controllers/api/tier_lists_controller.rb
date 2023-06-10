module Api
  class TierListsController < ApplicationController
    before_action :set_tier_list, only: %i(show update destroy)

    def index
      @tier_lists = TierList.all
      render json: @tier_lists
    end

    def show
      tier_list = TierList.find(params[:id])
      render json: tier_list.as_json(include: [:tiers, :inventory])
    end

    def inventories
      tier_list = TierList.find(params[:id])
      @inventories = tier_list.inventories
      render json: @inventories
    end

    def create
      tier_list = TierList.new(tier_list_params)

      if tier_list.save!
        render json: { tier_list: tier_list, inventory: tier_list.inventory }, status: :created
      else
        Rails.logger.error("TierList validation failed: #{tier_list.errors.full_messages}")
        render json: { error: tier_list.errors }, status: :unprocessable_entity
      end
    end


    def update
      @tier_list = TierList.find(params[:id])

      if @tier_list.update(tier_list_params)
        render json: @tier_list.as_json(include: :inventory)
      else
        render json: { errors: @tier_list.errors }, status: :unprocessable_entity
      end
    end


    def destroy
      @tier_list.destroy
    end

    def recent
      @tier_lists = TierList.posted.recent
      render json: @tier_lists
    end

    def popular
      @tier_lists = TierList.posted.popular
      render json: @tier_lists
    end

    def hot
      @tier_lists = TierList.posted.hot
      render json: @tier_lists
    end

    def user_lists
      @user = User.find(params[:id])
      @tier_lists = @user.tier_lists
      render json: @tier_lists
    end

    def posted_user_lists
      @user = User.find(params[:id])
      @tier_lists = @user.tier_lists.posted
      render json: @tier_lists
    end

    def unposted_user_lists
      @user = User.find(params[:id])
      @tier_lists = @user.tier_lists.unposted
      render json: @tier_lists
    end

    private

    def set_tier_list
      @tier_list = TierList.find(params[:id])
    end

    def tier_list_params
      params.require(:tier_list).permit(:title, :description, :source, :content_type, :user_id, :upvotes, :downvotes, :posted)
    end
    def inventory
      tier_list = TierList.find(params[:id])
      @inventory = tier_list.inventory
      render json: @inventory
    end
  end
end
