import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import pickle
import random
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import linear_kernel
from flask_cors import CORS
from flask import make_response

df_games = pd.read_csv(r'C:\Users\sport\OneDrive\Desktop\My game list\Python Recommender\Data\games.csv')
df_description = pd.read_csv(r'C:\Users\sport\OneDrive\Desktop\My game list\Python Recommender\Data\games_metadata mod.csv')
df_media = pd.read_csv(r'C:\Users\sport\OneDrive\Desktop\My game list\Python Recommender\Data\steam_media_data.csv')
df_tags = pd.read_csv(r'C:\Users\sport\OneDrive\Desktop\My game list\Python Recommender\Data\steamspy_tag_data.csv')

df_tags.rename(columns={'appid': 'app_id'}, inplace=True)

merged_df1 = pd.merge(pd.merge(df_games, df_description, on='app_id', how='inner'), df_media, on='app_id', how='inner')

merged_df = pd.merge(pd.merge(pd.merge(df_games, df_description, on='app_id', how='inner'), df_media, on='app_id', how='inner'), df_tags, on='app_id', how='inner')
tag_columns = df_tags.columns[15:] 
merged_df[tag_columns] = merged_df[tag_columns].applymap(lambda x: 1 if x > 0 else 0)

merged_df.head()

# DOCUMENT TO VECTOR METHOD (TF IDF)
tfidf = TfidfVectorizer(stop_words="english")
merged_df['description'] = merged_df['description'].fillna("")
tfidf_matrix = tfidf.fit_transform(merged_df['description'])

# DOCUMENT TO VECTOR METHOD (WORD2VEC)
            # # Preprocessing and tokenization of game descriptions
            # tokenized_descriptions = [description.split() for description in merged_df['description']]

            # # Train Word2Vec model
            # word2vec_model = Word2Vec(tokenized_descriptions, vector_size=300, window=5, min_count=1, sg=1)

            # # Create a function to get embeddings for a description
            # def get_description_embedding(description_tokens):
            #     description_embedding = np.mean([word2vec_model.wv[token] for token in description_tokens if token in word2vec_model.wv], axis=0)
            #     return description_embedding

            # # Calculate description embeddings
            # description_embeddings = [get_description_embedding(tokens) for tokens in tokenized_descriptions]

            # embedding_df = pd.DataFrame(description_embeddings, columns=[f"embedding_{i}" for i in range(300)])

            # # Add the embedding DataFrame with the original DataFrame
            # merged_df = pd.concat([merged_df, embedding_df], axis=1)


# COSINE SIMILARITY CALCULATION
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

tag_vectors = merged_df[tag_columns].values
tag_cosine_sim = cosine_similarity(tag_vectors)

alpha = 0.7  # Weight for description similarity
combined_similarity = alpha * cosine_sim + (1 - alpha) * tag_cosine_sim

# # CALCULATE COSINE SIMILARITY FOR THE WORD 2 VEC METHOD (AS IT USES DESCRIPTION EMBEDDINGS)
# description_embeddings = np.array(merged_df['description_embedding'].tolist())
# cosine_sim = cosine_similarity(description_embeddings)

# PICKLE DUMP
# with open('combined_similarity_matrix.pkl', 'wb') as f:
#     pickle.dump(combined_similarity, f)
    
# PICKLE LOAD
#with open('combined_similarity_matrix.pkl', 'rb') as f:
    #loaded_combined_similarity = pickle.load(f)

# Creating the Indices 
indices = pd.Series(merged_df.index, index = merged_df['title']).drop_duplicates()
indices

#RECOMMENDATION METHOD
def get_recommendations(title, combined_similarity = combined_similarity):
    idx = indices[title]
    sim_scores = enumerate(combined_similarity[idx])
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse = True)
    sim_scores = sim_scores[1:100]
    
    recommended_data = []
    
    i = [entry[0] for entry in sim_scores]
    
    p = [entry[1] for entry in sim_scores]
    
    for x in range(len(i)):
        if len(recommended_data) >= 10:
            break 
            
        if "Mixed" in merged_df['rating'].iloc[i[x]]:
            acceptance_probability = (0.5 + p[x]) * 0.2  #TRY TO MAKE THE DIFFERENCE BETWEEN A ^ SIMILARITY GAME AND A LOWER ONE GREATER (but since only 10 games returned, all the games have good similarity)
            
            if random.random() > acceptance_probability: 
                game_id = merged_df['app_id'].iloc[i[x]]
                game_title = merged_df['title'].iloc[i[x]]
                game_image_url = merged_df['header_image'].iloc[i[x]]
                recommended_data.append({'gid': game_id, 'title': game_title, 'image_url': game_image_url})
                recommended_data[-1]['gid'] = str(recommended_data[-1]['gid'])
                
        
        if "Positive" in merged_df['rating'].iloc[i[x]]:
            game_id = merged_df['app_id'].iloc[i[x]]
            game_title = merged_df['title'].iloc[i[x]]
            game_image_url = merged_df['header_image'].iloc[i[x]]
            recommended_data.append({'gid': game_id, 'title': game_title, 'image_url': game_image_url})
            recommended_data[-1]['gid'] = str(recommended_data[-1]['gid'])
        
    return recommended_data

# NETWORK
app = Flask(__name__)
CORS(app, supports_credentials=True)

# ENDPOINT
@app.route('/get_recommendations', methods=['POST'])
def get_recommendations_api():
    data = request.get_json()
    title = data.get('title')
    recommendations = get_recommendations(title)
    response = make_response(jsonify(recommendations))
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    
    # Print response headers
    print("Response Headers:", dict(response.headers))
    print(recommendations)
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run()
