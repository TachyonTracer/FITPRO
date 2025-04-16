from flask import Blueprint, request, jsonify
from Source.Class_recommender import hybrid_recommendation
from Source.Utils import load_data, preprocess

routes = Blueprint('routes', __name__)

# Load data once
df_cleaned, user_item_matrix, user_similarity_df = preprocess()

@routes.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_id = data['user_id']
    user_profile = data['user_profile']

    class_data = df_cleaned.drop_duplicates('class_id')

    recommendations = hybrid_recommendation(
        user_id=user_id,
        user_profile=user_profile,
        user_item_matrix=user_item_matrix,
        class_data = class_data,
        df_cleaned=df_cleaned,
        user_similarity_df=user_similarity_df
    )
    return jsonify({'recommended_class_ids': recommendations})
