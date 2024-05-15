import torch
from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
import json 
from pymongo import MongoClient
import re;
from bson import ObjectId

app = Flask(__name__)

model_name = 'sentence-transformers/bert-base-nli-mean-tokens'


tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

model_name = 'sentence-transformers/bert-base-nli-mean-tokens'


tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

def get_list_of_similar_observations(query_observation, category_id):
    client = MongoClient(host="localhost", port=27017)
    db = client["maintenance-management-system"]
    collection = db["failures"]
    
    failures_of_category = collection.find({"category": ObjectId(category_id)}, {"_id": 1, "denseVectorOfObservation": 1})

    #store all the dense vectors in this array
    dense_vector_of_observations = []
    
    #convert query into it's dense vector
    dense_vector_of_query_observation = convert_to_dense_vector(query_observation)
    
    failures = []
    for failure_of_category in failures_of_category:
        dense_vector_of_observations.append(torch.tensor(failure_of_category["denseVectorOfObservation"]))
        del failure_of_category["denseVectorOfObservation"]
        failure_of_category["_id"] = str(failure_of_category["_id"])
        failures.append(failure_of_category)
    dense_vector_of_observations = torch.stack(dense_vector_of_observations)
    
    #We need to detach tensor into something tensor cannot read anymore in order to use cosine_similarity
    dense_vector_of_query_observation = dense_vector_of_query_observation.detach().numpy()
    dense_vector_of_observations = dense_vector_of_observations.detach().numpy()
    
    #using cosine similarity
    similarity_list = cosine_similarity(
        dense_vector_of_query_observation,
        dense_vector_of_observations
    )
    
    i = 0
    for similarity_value in similarity_list[0]:
        failure = failures[i]
        failure['similarity_score'] = float(similarity_value)
        i += 1
    
    print(failures)
    
    failures.sort(key=lambda x: x['similarity_score'], reverse=True) 
    
    return failures
        

def convert_to_dense_vector(observation):
    tokens = {'input_ids': [], 'attention_mask': []}
    
    #tokenizing string
    new_token = tokenizer.encode_plus(observation, max_length=128,
                          truncation = True, padding='max_length', 
                          return_tensors='pt')

    #list of pytorch tensors
    tokens['input_ids'].append(new_token['input_ids'][0])
    tokens['attention_mask'].append(new_token['attention_mask'][0])
    
    #convert the list of pytorch tensors into single pytorch tensor
    #stack takes list and stacks them on top of each other which creates another dimension
    tokens['input_ids'] = torch.stack(tokens['input_ids'])
    tokens['attention_mask'] = torch.stack(tokens['attention_mask'])

    #give the tokens to pre trained model for the it to process 
    #Each token have the last hidden state tensor/vectors  which is the output of the final layer of the bert transformer architecture
    outputs = model(**tokens)

    embeddings = outputs.last_hidden_state
    
    #removing 0s
    #multiply every value in the last hidden state tensor by 0 where we should not have a real token
    #take each of the mask tokens and mutliply that out to remove any activations where there are padding tokens 
    #creating another dimension for attention mask so that we can multiply it with embeddings
    #allows us to expand the dimension out to 768 to multiple with the last hidden state tensor 
    #compare it to the embeddings vector and it will see that in needs to expand to 768
    attention = tokens['attention_mask']
    mask = attention.unsqueeze(-1).expand(embeddings.shape).float()
    mask_embeddings = embeddings * mask

    # right now the shape is [1, 128, 768]
    # we need to change the 128 vectors into 1 vector so that in the end the failure observation string will have one token 
    # removing the second dimension 
    summed = torch.sum(mask_embeddings, 1)
    summed.shape

    counts = torch.clamp(mask.sum(1), min=1e-9)
    counts.shape

    mean_pooled = summed / counts
    
    return mean_pooled


@app.route('/') 
def index(): 
	return "Flask server" 
 
@app.route('/convert-to-dense-vector', methods = ['POST']) 
def dense_vector(): 
    req = request.get_json()
    observation = req['observation']
    dense_vector_of_observation = convert_to_dense_vector(observation)
    print(dense_vector_of_observation)
    
    return jsonify({
        'dense_vector_of_observation': dense_vector_of_observation.tolist()[0]
    })

@app.route('/get-similar-failures', methods = ['POST']) 
def similar_obervations(): 
    req = request.get_json()
    print(req)
    observation_query = req['observationQuery']
    category = req['category']
    similar_failures = get_list_of_similar_observations(observation_query, category)
    # print(list_of_similar_observations)
    
    # get_list_of_similar_observations(observation_query, category)
    
    return jsonify({
        'similar_failures': similar_failures
    })
    
    # return jsonify({
    #     'dense_vector_of_observation': dense_vector_of_observation.tolist()[0]
    # })
    # do something with this data variable that contains the data from the node server 
    # return json.dumps({"newdata":"hereisthenewdatayouwanttosend"}) 
 
if __name__ == "__main__": 
	app.run(port=4000) 
    
    # def fetchMostSimilarDocument():