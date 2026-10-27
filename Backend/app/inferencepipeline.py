import torch
import pickle
from transformers import AutoTokenizer

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")

# Load label binarizer
with open(r"D:\FYP-Medical_Bot\Robomedix\Backend\app\mlb.pkl", "rb") as f:
    mlb = pickle.load(f)

# Load model structure
class MedPredictor(torch.nn.Module):
    def __init__(self, num_labels):
        super().__init__()
        from transformers import AutoModel
        self.bert = AutoModel.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
        self.dropout = torch.nn.Dropout(0.3)
        self.classifier = torch.nn.Linear(self.bert.config.hidden_size, num_labels)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        cls_output = outputs.last_hidden_state[:, 0, :]
        cls_output = self.dropout(cls_output)
        logits = self.classifier(cls_output)
        return logits


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = MedPredictor(num_labels=len(mlb.classes_))
model.load_state_dict(torch.load(r"D:\FYP-Medical_Bot\Robomedix\Backend\app\medicine_model.pt", map_location=device))
model.eval().to(device)


def predict_medicines(disease, symptoms, threshold=0.5):
    input_text = disease.lower() + ". " + symptoms.lower()

    
    inputs = tokenizer(input_text, return_tensors="pt", truncation=True, padding=True).to(device)


    with torch.no_grad():
        logits = model(inputs['input_ids'], inputs['attention_mask'])
        probs = torch.sigmoid(logits)

 
    probs = probs.cpu().numpy()[0]
    pred_indices = [i for i, p in enumerate(probs) if p >= threshold]
    predicted_medicines = mlb.classes_[pred_indices]

    return list(predicted_medicines)


# disease = input("Enter the disease: ")
# symptoms = input("Enter the symptoms (comma-separated): ")

# predicted = predict_medicines(disease, symptoms)
# print("Predicted Medicines:", predicted)