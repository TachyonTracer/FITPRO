from flask import Blueprint, request, jsonify
from Source.Class_recommender import hybrid_recommendation
from Source.Utils import load_data, preprocess
import pandas as pd
from Source.Class_prediction import *

routes = Blueprint('routes', __name__)


# CLASS RECOMMENDATION
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



# CLASS POPULARITY PREDICTION
@routes.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from request
        # data = request.get_json()
        data = request.json

        # Convert to DataFrame
        new_class_df = pd.DataFrame([data])

        # Prepare for prediction
        X_new = prepare_new_class_for_prediction(new_class_df, feature_columns)

        # Make prediction
        prediction, probability = predict_class_popularity(model, X_new, feature_columns)

        # Interpret results
        result = interpret_prediction(prediction, probability, X_new, feature_importance)

        # Return response
        return jsonify({
            'success': True,
            'is_popular': result['is_popular'],
            'popularity_probability': result['popularity_probability'],
            'confidence_level': result['confidence_level'],
            'reasons': result['reasons'],
            'recommendations': result['recommendations']
        })
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({
            'success': False,
            'message': 'Error processing prediction',
            'error': str(e)
        }), 500
