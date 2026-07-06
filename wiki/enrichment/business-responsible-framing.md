# Business & Responsible AI Framing — Bổ sung (Nhóm B)

> Trang bổ sung phần "business & responsible-AI framing" (khung tư duy kinh doanh + AI có trách nhiệm) — nội dung nặng ở **Domain 2 (24%)** và **Domain 4 (14%)**, thường bị thiếu trong các khoá học thiên về kỹ thuật.

---

## A. GenAI capabilities & limitations for business (Task 2.2)

### A.1 Advantages of GenAI (Ưu điểm)
- **Adaptability (khả năng thích ứng):** một foundation model duy nhất xử lý nhiều tác vụ (summarize, translate, code, chat) mà không cần train lại — chỉ đổi prompt.
- **Responsiveness (phản hồi nhanh):** tạo nội dung/câu trả lời gần thời gian thực, hỗ trợ trải nghiệm hội thoại tức thì.
- **Simplicity (đơn giản hoá):** hạ rào cản kỹ thuật — dùng ngôn ngữ tự nhiên thay vì viết code/ML pipeline; rút ngắn time-to-market.

🎯 **Exam tip:** Nếu câu hỏi nhấn "một mô hình dùng cho nhiều use case khác nhau" → chọn **adaptability**; "dễ dùng, không cần chuyên gia ML" → **simplicity**.

### A.2 Disadvantages / limitations (Nhược điểm)
- **Hallucinations (ảo giác):** tạo ra thông tin nghe hợp lý nhưng **sai/bịa đặt**. Đây là distractor "tủ" cho mọi rủi ro độ tin cậy.
- **Interpretability (khó diễn giải):** mô hình là "hộp đen", khó giải thích **vì sao** ra kết quả đó.
- **Inaccuracy (thiếu chính xác):** đầu ra có thể sai sự thật, lỗi thời, hoặc lệch ngữ cảnh.
- **Nondeterminism (phi tất định):** cùng một prompt có thể cho **nhiều đáp án khác nhau** (do sampling/temperature) → khó tái lập, khó test.

🎯 **Exam tip:** "Cần cùng input → cùng output mỗi lần" là điểm yếu **nondeterminism**; nếu yêu cầu này là bắt buộc thì GenAI **không** phù hợp (xem mục B).

### A.3 Factors to select a GenAI model (Tiêu chí chọn mô hình)
- **Model type (loại mô hình):** text LLM, multimodal, image/diffusion, embedding… — phải khớp modality của bài toán.
- **Performance requirements (yêu cầu hiệu năng):** latency, throughput, chất lượng đầu ra.
- **Capabilities (năng lực):** đa ngôn ngữ, độ dài context, reasoning, code, function calling.
- **Constraints (ràng buộc):** chi phí, token limits, hạ tầng, kích thước mô hình.
- **Compliance (tuân thủ):** data residency, quy định ngành, licensing, quyền riêng tư.

### A.4 Business value & metrics (Giá trị & chỉ số kinh doanh)
| Metric | Ý nghĩa (1 dòng) |
|---|---|
| **Cross-domain performance** | Mô hình chạy tốt trên **nhiều lĩnh vực/tác vụ** khác nhau, không chỉ một domain hẹp. |
| **Efficiency (hiệu suất)** | Tiết kiệm thời gian/chi phí/công sức so với cách làm thủ công. |
| **Conversion rate (tỷ lệ chuyển đổi)** | % người dùng thực hiện hành động mong muốn (mua, đăng ký) — đo tác động thương mại. |
| **Average revenue per user (ARPU)** | Doanh thu trung bình trên mỗi người dùng. |
| **Accuracy (độ chính xác)** | Mức đầu ra đúng/đáng tin — chất lượng phản hồi GenAI. |
| **Customer lifetime value (CLV/CLTV)** | Tổng giá trị một khách hàng mang lại trong suốt vòng đời quan hệ. |

🎯 **Exam tip:** Phân biệt **model metrics** (accuracy, AUC, F1 — mục C) với **business metrics** (ARPU, CLV, conversion rate, ROI). Câu hỏi kiểu "đo tác động **kinh doanh** của giải pháp GenAI" → chọn ARPU/CLV/conversion, **không** chọn F1/AUC.

---

## B. When AI/ML is (not) appropriate (Task 1.2)

### B.1 Nơi AI/ML tạo giá trị
- **Assist human decision-making (hỗ trợ quyết định):** gợi ý/xếp hạng để con người quyết định cuối (ví dụ chẩn đoán hỗ trợ, chấm điểm rủi ro).
- **Scalability (mở rộng quy mô):** xử lý khối lượng lớn vượt sức người (hàng triệu giao dịch/ảnh/văn bản).
- **Automation (tự động hoá):** thay thế tác vụ lặp lại, tốn công (phân loại, trích xuất, phản hồi tuyến đầu).

### B.2 Khi KHÔNG nên dùng AI/ML
- **Cost-benefit không hợp lý:** chi phí xây/vận hành/dữ liệu vượt lợi ích thu được.
- **Cần kết quả tất định/chính xác tuyệt đối** thay vì **dự đoán xác suất:** phép tính lương, thuế, kế toán → dùng **rule-based/công thức**, không dùng ML.
- **Bắt buộc interpretability / chắc chắn pháp lý:** khi luật yêu cầu giải thích rõ ràng từng quyết định mà mô hình không đáp ứng được.
- **Dữ liệu không đủ / kém chất lượng:** thiếu dữ liệu, dữ liệu nhiễu/thiên lệch → mô hình không đáng tin.

🎯 **Exam tip:** Từ khoá **"a specific/exact outcome is needed instead of a prediction"** → câu trả lời là **KHÔNG dùng AI/ML**, dùng logic xác định (deterministic). Đây là bẫy kinh điển của Task 1.2.

---

## C. Business metrics vs model metrics (Task 1.3)

### C.1 Model (technical) metrics — recap nhanh
- **Accuracy:** tỷ lệ dự đoán đúng trên tổng số. Dễ gây hiểu lầm khi dữ liệu **mất cân bằng** (imbalanced).
- **AUC (Area Under ROC Curve):** khả năng mô hình **phân biệt** lớp dương/âm; 1.0 = hoàn hảo, 0.5 = đoán mò.
- **F1 score:** trung bình điều hoà của **precision & recall** — tốt cho lớp hiếm/imbalanced.

### C.2 Business metrics
- **Cost per user:** chi phí phục vụ mỗi người dùng (gồm cả inference/token).
- **Development cost:** chi phí xây dựng, huấn luyện, triển khai giải pháp.
- **Customer feedback:** phản hồi/đánh giá/hài lòng của khách hàng.
- **ROI (Return on Investment):** lợi nhuận thu về so với chi phí bỏ ra — thước đo tổng thể giá trị dự án.

🎯 **Exam tip:** Model metric = "mô hình **tốt** tới đâu về mặt kỹ thuật"; Business metric = "giải pháp mang lại **giá trị** gì cho doanh nghiệp". Đừng nhầm hai nhóm.

---

## D. Responsible AI — framing (Domain 4)

### D.1 Features of responsible AI (Task 4.1)
- **Bias (thiên lệch):** sai lệch có hệ thống làm một số nhóm/kết quả bị đối xử không công bằng.
- **Fairness (công bằng):** đối xử công bằng giữa các cá nhân/nhóm nhân khẩu học.
- **Inclusivity (tính bao trùm):** phục vụ được nhiều nhóm người dùng đa dạng, không bỏ sót.
- **Robustness (độ bền vững):** hoạt động ổn định trước dữ liệu nhiễu, bất thường, hoặc tấn công.
- **Safety (an toàn):** ngăn đầu ra gây hại/độc hại/nguy hiểm.
- **Veracity (tính xác thực):** đầu ra đúng sự thật, đáng tin cậy (chống hallucination).

🎯 **Exam tip:** **Guardrails for Amazon Bedrock** là công cụ chính để lọc nội dung độc hại/chủ đề bị cấm; **SageMaker Clarify** để phát hiện **bias** và giải thích (explainability); **Amazon A2I** để đưa **human review** vào vòng lặp.

### D.2 Legal risks of GenAI
- **IP infringement claims:** đầu ra có thể sao chép/xâm phạm bản quyền, nhãn hiệu từ dữ liệu huấn luyện.
- **Biased outputs:** kết quả thiên lệch → rủi ro phân biệt đối xử, kiện tụng.
- **Loss of customer trust:** đầu ra sai/thiên lệch làm mất niềm tin khách hàng.
- **End-user risk:** người dùng hành động dựa trên thông tin sai → gây hại thực tế.
- **Hallucinations:** thông tin bịa đặt có thể dẫn tới trách nhiệm pháp lý.

### D.3 Dataset characteristics for responsible AI
- **Inclusivity:** dữ liệu đại diện cho mọi nhóm liên quan.
- **Diversity:** đa dạng nguồn, bối cảnh, nhân khẩu học.
- **Curated data sources:** nguồn được chọn lọc, kiểm định chất lượng, có xuất xứ rõ ràng.
- **Balanced datasets:** cân bằng giữa các lớp/nhóm để tránh mô hình lệch về nhóm chiếm đa số.

### D.4 Bias vs variance (Task 4.1)
- **Underfitting (high bias):** mô hình quá đơn giản → học không đủ, sai cả trên train lẫn test.
- **Overfitting (high variance):** học thuộc dữ liệu train (kể cả nhiễu) → kém trên dữ liệu mới.
- **Effect on demographic groups:** bias trong dữ liệu → mô hình **chính xác kém hơn** cho các nhóm ít được đại diện → kết quả **không công bằng**.

🎯 **Exam tip:** "Tốt trên train, tệ trên dữ liệu mới" = **overfitting/variance**; "tệ ở mọi nơi, quá đơn giản" = **underfitting/bias".

### D.5 Transparency & explainability (Task 4.2)
- **Transparent/explainable models** (linear/logistic regression, decision tree): dễ hiểu vì sao ra quyết định.
- **Opaque/"black-box" models** (deep neural nets, LLM lớn): mạnh hơn nhưng khó diễn giải.
- **Interpretability ↔ performance tradeoff:** thường mô hình càng mạnh/phức tạp thì càng khó giải thích; phải cân nhắc theo bối cảnh (y tế, tài chính, pháp lý → ưu tiên interpretability).
- **Human-centered design for explainable AI:** thiết kế lấy con người làm trung tâm — cung cấp lời giải thích dễ hiểu, cho phép con người giám sát/can thiệp (human-in-the-loop), minh bạch về giới hạn của mô hình.
- **Công cụ:** **SageMaker Model Cards** (tài liệu hoá mục đích/giới hạn/hiệu năng), **SageMaker Clarify** (feature importance/explainability), open-source models + data + licensing (tăng minh bạch).

### D.6 Sustainability / environmental considerations
- Huấn luyện & inference mô hình lớn tiêu tốn nhiều **năng lượng/tài nguyên** → cân nhắc khi chọn mô hình.
- Thực hành có trách nhiệm: chọn **mô hình nhỏ vừa đủ** cho tác vụ, tái sử dụng **pre-trained/foundation models** thay vì train từ đầu, dùng fine-tuning/RAG thay vì pre-training, chọn phần cứng/hạ tầng hiệu quả năng lượng.

🎯 **Exam tip:** Khi câu hỏi hỏi "responsible practice để **chọn** mô hình" và có phương án về **environmental/sustainability** → đó thường là đáp án đúng cho khía cạnh này; ưu tiên tái dùng mô hình có sẵn và chọn kích thước phù hợp.

---

### Quick recall (chốt lại)
- **Adaptability / responsiveness / simplicity** = ưu điểm GenAI; **hallucination / interpretability / inaccuracy / nondeterminism** = nhược điểm.
- **Exact outcome needed** → đừng dùng ML.
- **F1/AUC/accuracy** = model metrics; **ROI/ARPU/CLV/conversion** = business metrics.
- Responsible AI = **bias, fairness, inclusivity, robustness, safety, veracity** + minh bạch + bền vững.
- Tools: **Bedrock Guardrails, SageMaker Clarify, Model Monitor, Model Cards, Amazon A2I**.
