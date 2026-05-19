/*
 * Modular publication data for the homepage.
 *
 * To add a paper, append one object to `papers` below.
 * Set `selected: true` to show it in the Representative tab.
 * Add one or more topic names in `topics` to enable filtering in All Publications.
 * Papers with an empty `topics` array remain visible in All Publications but show no topic tag.
 */
window.PUBLICATIONS = {
  "topics": [
    "Multimodal Agents",
    "Vision-Language Reasoning",
    "Medical AI",
    "Evaluation & Benchmarks",
    "Video Understanding",
    "Embodied AI",
    "Visual Grounding",
    "Domain Generalization",
    "AI for Science",
    "Federated Learning"
  ],
  "papers": [
    {
      "id": "carepilot",
      "selected": false,
      "year": 2026,
      "title": "CarePilot: A Multi-Agent Framework for Long-Horizon Computer Task Automation in Healthcare",
      "authors": [
        "Akash Ghosh",
        "Tajamul Ashraf",
        "Rishu Kumar Singh",
        "Numan Saeed",
        "Sriparna Saha",
        "Xiuying Chen",
        "Salman Khan"
      ],
      "venue": "CVPR 2026 Findings Track",
      "image": "assets/Profile Picture/papers/carepilot.png",
      "imageAlt": "CarePilot paper thumbnail generated from the paper PDF",
      "links": [
        {
          "label": "webpage",
          "url": "https://akashghosh.github.io/Care-Pilot/"
        },
        {
          "label": "paper",
          "url": "https://arxiv.org/abs/2603.24157"
        },
        {
          "label": "code",
          "url": "https://github.com/AkashGhosh/CarePilot"
        }
      ],
      "topics": [
        "Multimodal Agents",
        "Vision-Language Reasoning",
        "Embodied AI",
        "Medical AI",
        "Evaluation & Benchmarks",
        "Visual Grounding"
      ],
      "abstract": "CarePilot introduces CareFlow, a benchmark for long-horizon healthcare software automation, and an actor-critic multi-agent framework that combines tool grounding with short- and long-term memory for clinical GUI workflows."
    },
    {
      "id": "agent-x",
      "selected": true,
      "year": 2026,
      "title": "Agent-X: Evaluating Deep Multimodal Reasoning in Vision-Centric Agentic Tasks",
      "authors": [
        "Tajamul Ashraf*",
        "Amal Saqib*",
        "Hanan Ghani",
        "Muhra AlMahri",
        "Yuhao Li",
        "Noor Ahsan",
        "Umair Nawaz",
        "Jean Lahoud",
        "Hisham Cholakkal",
        "Mubarak Shah",
        "Philip Torr",
        "Fahad Shahbaz Khan",
        "Rao Muhammad Anwer",
        "Salman Khan"
      ],
      "venue": "ICLR 2026",
      "image": "assets/Profile Picture/papers/agentx.png",
      "imageAlt": "Agent-X paper thumbnail generated from the paper PDF",
      "links": [
        {
          "label": "webpage",
          "url": "https://github.com/mbzuai-oryx/Agent-X"
        },
        {
          "label": "paper",
          "url": "https://openreview.net/forum?id=Vjruxvp1Xd"
        },
        {
          "label": "code",
          "url": "https://github.com/mbzuai-oryx/Agent-X"
        }
      ],
      "topics": [
        "Evaluation & Benchmarks",
        "Multimodal Agents",
        "Vision-Language Reasoning",
        "Embodied AI",
        "Visual Grounding"
      ],
      "abstract": "Agent-X evaluates deep multimodal reasoning in vision-centric agentic tasks. It focuses on multi-step reasoning, tool use, and authentic visual contexts across domains such as web browsing, surveillance, autonomous driving, sports, and math reasoning."
    },
    {
      "id": "calibration-aware-fetal-head-segmentation",
      "selected": false,
      "year": 2026,
      "title": "Calibration-Aware Semi-Supervised Fetal Head Segmentation with Boundary-Positive Contrast",
      "authors": [
        "Ufaq Khan",
        "Umair Nawaz",
        "Tajamul Ashraf",
        "Tausifa Jan Saleem",
        "Massimo Caputo",
        "S. A. Narayan",
        "Muhammad Bilal",
        "and collaborators"
      ],
      "venue": "MIDL 2026",
      "image": "assets/Profile Picture/papers/ultraseminet.png",
      "imageAlt": "Calibration-aware fetal head segmentation paper thumbnail generated from the paper PDF",
      "links": [
        {
          "label": "paper",
          "url": "https://openreview.net/forum?id=RAlAyEHSI4"
        },
        {
          "label": "pdf",
          "url": "https://openreview.net/pdf?id=RAlAyEHSI4"
        }
      ],
      "topics": [
        "Medical AI",
        "Domain Generalization"
      ],
      "abstract": "This work presents a calibration-aware semi-supervised framework for fetal head segmentation in ultrasound, with boundary-positive contrast and selective pseudo-supervision designed to improve boundary fidelity under limited annotation."
    },
    {
      "id": "phase-informed-tool-segmentation-msics",
      "selected": false,
      "year": 2025,
      "title": "Phase-informed Tool Segmentation for Manual Small-Incision Cataract Surgery",
      "authors": [
        "Bhuvan Sachdeva",
        "Naren Akash",
        "Tajamul Ashraf",
        "Simon Müller",
        "Thomas Schultz",
        "Maximilian W. M. Wintergerst",
        "Niharika Singri Prasad",
        "Kaushik Murali",
        "Mohit Jain"
      ],
      "venue": "MICCAI 2025",
      "image": "assets/Profile Picture/papers/toolseg.png",
      "imageAlt": "Phase-informed surgical tool segmentation thumbnail",
      "links": [
        {
          "label": "paper",
          "url": "https://papers.miccai.org/miccai-2025/paper/1776_paper.pdf"
        },
        {
          "label": "springer",
          "url": "https://link.springer.com/chapter/10.1007/978-3-032-05114-1_43"
        }
      ],
      "topics": [
        "Medical AI",
        "Video Understanding",
        "Embodied AI",
        "Visual Grounding"

      ],
      "abstract": "This work introduces phase-informed tool segmentation for manual small-incision cataract surgery and studies how surgical phase context can improve pixel-level tool segmentation in ophthalmic videos."
    },
    {
      "id": "medmask",
      "selected": false,
      "year": 2025,
      "title": "MedMask: A Self-supervised Vision Foundation Model for Breast Cancer Detection Using Mammograms",
      "authors": [
        "Tajamul Ashraf",
        "S. Salmani",
        "M. Peerzada",
        "Ufaq Khan",
        "Y. Xie",
        "Janibul Bashir"
      ],
      "venue": "MICCAI 2025 Deep Breast Workshop",
      "image": "assets/Profile Picture/papers/medmask.png",
      "imageAlt": "MedMask framework thumbnail",
      "links": [
        {
          "label": "paper",
          "url": "https://link.springer.com/chapter/10.1007/978-3-032-05559-0_34"
        },
        {
          "label": "code",
          "url": "https://github.com/Tajamul21/MedMask"
        }
      ],
      "topics": [
        "Medical AI",
        "Domain Generalization"
      ],
      "abstract": "MedMask is a self-supervised masking framework for breast cancer detection from mammograms. It uses vision foundation models and masked representation learning to improve detection in annotation-scarce medical imaging settings."
    },
    {
      "id": "mira-medical-rag",
      "selected": false,
      "year": 2025,
      "title": "MIRA: A Novel Framework for Fusing Modalities in Medical RAG",
      "authors": [
        "Jinhong Wang*",
        "Tajamul Ashraf*",
        "Zongyan Han",
        "Jorma Laaksonen",
        "Rao Muhammad Anwer"
      ],
      "venue": "ACM Multimedia 2025",
      "image": "assets/Profile Picture/papers/mira_mm.png",
      "imageAlt": "MIRA medical RAG thumbnail",
      "links": [
        {
          "label": "webpage",
          "url": "https://mbzuai-oryx.github.io/MIRA/"
        },
        {
          "label": "paper",
          "url": "https://arxiv.org/abs/2507.07902"
        },
        {
          "label": "code",
          "url": "https://github.com/mbzuai-oryx/MIRA"
        }
      ],
      "topics": [
        "Medical AI",
        "Vision-Language Reasoning",
        "Visual Grounding"
      ],
      "abstract": "MIRA improves medical retrieval-augmented generation by fusing visual and textual modalities, dynamically managing retrieved context, and supporting factual multimodal reasoning in medical VQA and report-generation tasks."
    },
    {
      "id": "titan",
      "selected": true,
      "year": 2025,
      "title": "TITAN: Query-Token based Domain Adaptive Adversarial Learning",
      "authors": [
        "Tajamul Ashraf",
        "Janibul Bashir"
      ],
      "venue": "ICCV 2025",
      "image": "assets/Profile Picture/papers/titan_iccv.png",
      "imageAlt": "TITAN domain adaptation thumbnail",
      "links": [
        {
          "label": "paper",
          "url": "https://mlanthology.org/iccv/2025/ashraf2025iccv-titan/"
        },
        {
          "label": "pdf",
          "url": "https://openaccess.thecvf.com/content/ICCV2025/papers/Ashraf_TITAN_Query-Token_based_Domain_Adaptive_Adversarial_Learning_ICCV_2025_paper.pdf"
        },
        {
          "label": "code",
          "url": "https://github.com/Tajamul21/TITAN"
        }
      ],
      "topics": ["Domain Generalization",
        "Visual Grounding"],
      "abstract": "TITAN addresses source-free domain adaptive object detection by partitioning target samples and using query-token based adversarial learning to reduce domain gaps without source data during adaptation."
    },
    {
      "id": "ccpm-climate-change-understanding",
      "selected": false,
      "year": 2024,
      "title": "Enhancing Climate Change Understanding: A Novel Deep Learning Framework with the Climate Change Parameter Model (CCPM)",
      "authors": [
        "Tajamul Ashraf",
        "Janibul Bashir"
      ],
      "venue": "MoSICom 2024",
      "image": "assets/Profile Picture/papers/mosicom.png",
      "imageAlt": "Climate change parameter model thumbnail",
      "links": [
        {
          "label": "toc",
          "url": "https://www.proceedings.com/content/078/078982webtoc.pdf"
        }
      ],
      "topics": [
        "Domain Generalization",
        "Visual Grounding"
      ],
      "abstract": "This work studies climate change understanding using a deep learning framework centered on a Climate Change Parameter Model for analyzing and forecasting climate-related indicators."
    },
    {
      "id": "d-master",
      "selected": true,
      "year": 2024,
      "title": "D-MASTER: Mask Annealed Transformer for Unsupervised Domain Adaptation in Breast Cancer Detection from Mammograms",
      "authors": [
        "Tajamul Ashraf",
        "Krithika Rangarajan",
        "Mohit Gambhir",
        "Richa Gauba",
        "Chetan Arora"
      ],
      "venue": "MICCAI 2024",
      "image": "assets/Profile Picture/papers/dmaster.png",
      "imageAlt": "D-MASTER mammography domain adaptation thumbnail",
      "links": [
        {
          "label": "webpage",
          "url": "https://dmaster-iitd.github.io/webpage/"
        },
        {
          "label": "paper",
          "url": "https://papers.miccai.org/miccai-2024/239-Paper1343.html"
        },
        {
          "label": "code",
          "url": "https://github.com/Tajamul21/D-MASTER"
        }
      ],
      "topics": [
        "Medical AI",
        "Domain Generalization"
      ],
      "abstract": "D-MASTER proposes a mask-annealed transformer framework for unsupervised domain adaptation in breast cancer detection from mammograms, targeting robust cross-domain detection under limited labeled data."
    },
    {
      "id": "hf-fed",
      "selected": false,
      "year": 2024,
      "title": "HF-Fed: Hierarchical based Customized Federated Learning Framework for X-Ray Imaging",
      "authors": [
        "Tajamul Ashraf",
        "Tisha Madame"
      ],
      "venue": "MICCAI Deep-Breath 2024",
      "image": "assets/Profile Picture/papers/hffed.png",
      "imageAlt": "HF-Fed federated medical imaging thumbnail",
      "links": [
        {
          "label": "paper",
          "url": "https://link.springer.com/chapter/10.1007/978-3-031-77789-9_2"
        },
        {
          "label": "code",
          "url": "https://github.com/Tajamul21/HF-Fed"
        }
      ],
      "topics": [
        "Medical AI",
        "Federated Learning",
        "Domain Generalization"
      ],
      "abstract": "HF-Fed is a hierarchical federated learning framework for customized X-ray imaging. It decomposes local data adaptation and global imaging learning to improve medical imaging without centralizing hospital data."
    },
    {
      "id": "transfed",
      "selected": true,
      "year": 2024,
      "title": "TransFed: A Way to Epitomize Focal Modulation Using Transformer-Based Federated Learning",
      "authors": [
        "Tajamul Ashraf",
        "Fuzayil Bin Afzal Mir",
        "Iqra Altaf Gillani"
      ],
      "venue": "WACV 2024",
      "image": "assets/Profile Picture/papers/transfed.png",
      "imageAlt": "TransFed federated learning thumbnail",
      "links": [
        {
          "label": "paper",
          "url": "https://openaccess.thecvf.com/content/WACV2024/html/Ashraf_TransFed_A_Way_To_Epitomize_Focal_Modulation_Using_Transformer-Based_Federated_WACV_2024_paper.html"
        },
        {
          "label": "pdf",
          "url": "https://openaccess.thecvf.com/content/WACV2024/papers/Ashraf_TransFed_A_Way_To_Epitomize_Focal_Modulation_Using_Transformer-Based_Federated_WACV_2024_paper.pdf"
        },
        {
          "label": "code",
          "url": "https://github.com/Tajamul21/TransFed"
        }
      ],
      "topics": [
        "Federated Learning",
        "Domain Generalization",
        "AI for Science"
      ],
      "abstract": "TransFed studies focal modulation in federated learning and introduces a transformer-based framework with learn-to-customize mechanisms for heterogeneous client distributions."
    },
    {
      "id": "posewatch",
      "selected": false,
      "year": 2023,
      "title": "PoseWatch: Advancing Real Time Human Pose Tracking and Juxtaposition with Deep Learning",
      "authors": [
        "Tajamul Ashraf",
        "B. V. Balaji Prabu",
        "Omkar Subbaram Jois Narasipura"
      ],
      "venue": "CVIP 2023",
      "image": "assets/Profile Picture/papers/posewatch.png",
      "imageAlt": "PoseWatch human pose tracking thumbnail",
      "links": [
        {
          "label": "paper",
          "url": "https://link.springer.com/chapter/10.1007/978-3-031-58181-6_2"
        },
        {
          "label": "code",
          "url": "https://github.com/Tajamul21/PoseWatch-Advancing-Real-Time-Human-Pose-Tracking-and-Juxtaposition-with-Deep-Learning"
        }
      ],
      "topics": ["Video Understanding",
        "Embodied AI",
        "Visual Grounding"],
      "abstract": "PoseWatch advances real-time human pose tracking and juxtaposition with deep learning, supporting activity monitoring and movement analysis through human keypoint estimation."
    },
    {
      "id": "ccpd-dataset",
      "selected": false,
      "year": 2023,
      "title": "Climate Change Parameter Dataset (CCPD): A Benchmark Dataset for Climate Change Parameters in Jammu and Kashmir",
      "authors": [
        "Tajamul Ashraf",
        "Janibul Bashir"
      ],
      "venue": "ICDSA 2023",
      "image": "assets/Profile Picture/papers/ccpd.png",
      "imageAlt": "CCPD climate dataset thumbnail",
      "links": [
        {
          "label": "paper",
          "url": "https://link.springer.com/chapter/10.1007/978-981-99-7862-5_1"
        },
        {
          "label": "pdf",
          "url": "assets/Documents/icdsa/paper.pdf"
        }
      ],
      "topics": [
        "AI for Science",
        "Evaluation & Benchmarks"
      ],
      "abstract": "CCPD is a benchmark dataset for climate-change parameters in Jammu and Kashmir, covering factors such as forest cover, water bodies, agriculture, vegetation, population, temperature, construction, and air index."
    },
    {
      "id": "apple-vision-system",
      "selected": false,
      "year": 2022,
      "title": "An Integral Computer Vision System for Apple Detection, Classification, and Semantic Segmentation",
      "authors": [
        "Tajamul Ashraf",
        "Naiyer Abbas",
        "Mohammad Haseeb",
        "Nadeem Yousuf",
        "Janibul Bashir"
      ],
      "venue": "ICMV 2022",
      "image": "assets/Profile Picture/papers/apples_cv.png",
      "imageAlt": "Apple detection and segmentation thumbnail",
      "links": [
        {
          "label": "paper",
          "url": "https://journals.spiedigitallibrary.org/conference-proceedings-of-spie/12701/127011H/An-integral-computer-vision-system-for-apple-detection-classification-and/10.1117/12.2680881.full"
        },
        {
          "label": "code",
          "url": "https://github.com/Tajamul21/Detection-Classification-and-Semantic_Segmentation-of-apples"
        }
      ],
      "topics": ["Visual Grounding",
        "AI for Science"],
      "abstract": "This work presents an integrated computer vision system for apple detection, classification, and semantic segmentation, supporting visual understanding for agricultural applications."
    }
  ]
};