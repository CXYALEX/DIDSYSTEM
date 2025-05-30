<template>
  <div>
    <!-- section III -->
    <section class="middle-section">
      <h2 class="middle-title">What is Web3polyu?</h2>
      <div class="middle-additional-description">
    <p class="intro-paragraph">
      Web3polyu is an <strong>open-source</strong> decentralized identity infrastructure revolutionizing Web3 privacy through AI-powered anonymous credentials.Our developed Web3polyu infrastructure empowers developers to further build compliant Web3 applications with:
    </p>
    
    <div class="features-container">
      <div class="feature-column">
        <h3 class="feature-title">Fundamental Functions</h3>
        <ul class="feature-list">
          <li>
            <span class="number">1</span>
            <span class="feature-text"><strong>Multiple roles</strong>: issuer, user/holder, verifier</span>
          </li>
          <li>
            <span class="number">2</span>
            <span class="feature-text"><strong>DID</strong> creation and management</span>
          </li>
          <li>
            <span class="number">3</span>
            <span class="feature-text"><strong>Credential</strong> application and presentation</span>
          </li>
        </ul>
      </div>
      
      <div class="feature-column">
        <h3 class="feature-title">Advanced Security Features</h3>
        <ul class="feature-list">
          <li>
            <span class="number">1</span>
            <span class="feature-text">Zero-knowledge proofs</span>
          </li>
          <li>
            <span class="number">2</span>
            <span class="feature-text">BBS+ signatures</span>
          </li>
          <li>
            <span class="number">3</span>
            <span class="feature-text">LLM powered credentialengine</span>
          </li>
        </ul>
      </div>
    </div>
    
    <p class="intro-paragraph">
      Our DID management methods ensure complete transaction unlinkability, dynamic credential management, and minimal data exposure through selective disclosure capabilities. We enable truly <strong>user-controlled digital identities</strong> with cryptographic privacy guarantees.
    </p>
  </div>
        <!-- Web3polyu is an open-source decentralized identity infrastructure revolutionizing Web3 privacy through AI-powered anonymous credentials. As the first platform combining zero-knowledge proofs, BBS+ signatures, and LLM intelligence, we enable truly user-controlled digital identities with cryptographic privacy guarantees. Our modular system empowers developers to build compliant Web3 applications while ensuring complete transaction unlinkability, dynamic credential management, and minimal data exposure through selective disclosure capabilities.</p>  -->
      <el-row :gutter="20" class="middle-feature-row">
        <!-- Card 1 -->
          <el-card class="middle-card">
            <div class="middle-picture">
                <img src="@/assets/image/overview.svg" alt="KYC Icon" class="middle-card-icon-img" />
            </div>
            <div class="middle-card-content">
              <h3>Digital identity infrastructure</h3>
              <!-- <p>A set of open-source software and infrastructure for developers to include privacy-first identity management features into their applications.</p> -->
            </div>
          </el-card>
      </el-row>
    </section>

<!-- Standalone Title outside the section -->
<h2 class="standalone-title">Trust Infrastructure Core</h2>

<!-- Entity Resolution Section -->
<section class="entity-resolution-section">
  <div class="entity-resolution-container">
    <!-- Left side: Feature points -->
    <div class="entity-features">
      <div class="feature-item" :class="{'active': currentContent === 1}" @mouseover="changeContent(1)">
        <h3>Open-Source Architecture</h3>
        <div class="feature-content" :class="{'expanded': currentContent === 1}">
          <p>
            Web3polyu's modular design supports multi-role participation through three core components:
          </p>
          <ul>
            <li><strong>Credential Management Platform:</strong> Enables institutions to issue privacy-preserving credentials with ZKP-enabled selective disclosure capabilities, supporting multiple revocation models</li>
            <li><strong>Identity Wallet:</strong> Allows users to create self-sovereign identities, manage credentials locally, and conduct unlinkable authentication through decentralized identifiers (DIDs)</li>
            <li><strong>Verifier SDK:</strong> Provides developers with plug-and-play modules for credential verification, featuring blockchain status checks and privacy-preserving proof verification</li>
          </ul>
          <p>Our open-source middleware supports custom extensions while maintaining interoperability through W3C-compliant standards.</p>
        </div>
      </div>
      
      <hr class="feature-divider">
      
      <div class="feature-item" :class="{'active': currentContent === 2}" @mouseover="changeContent(2)">
        <h3>Next-Gen Intelligent Privacy Stack</h3>
        <div class="feature-content" :class="{'expanded': currentContent === 2}">
          <p>
            Web3polyu introduces groundbreaking technical capabilities:
          </p>
          <ul>
            <li><strong>World's First LLM-Powered Credential Engine:</strong> Transform natural language requirements into standardized credential templates with automatic cryptographic parameter configuration</li>
            <li><strong>Advanced Privacy Stack:</strong> Combines zk-SNARKs for selective disclosure with BBS+ signatures for multi-show unlinkability, achieving military-grade privacy</li>
            <li><strong>Dynamic Credential Ecosystem:</strong> Supports time-bound credentials, delegated issuance, and cross-chain revocation status synchronization</li>
          </ul>
          <!-- <p>These innovations reduce development complexity while enhancing security - our hybrid approach decreases ZKP circuit setup time by 73% compared to conventional solutions.</p> -->
        </div>
      </div>
      
      <hr class="feature-divider">
      
      <div class="feature-item" :class="{'active': currentContent === 3}" @mouseover="changeContent(3)">
        <h3>Decentralized Security by Design</h3>
        <div class="feature-content" :class="{'expanded': currentContent === 3}">
          <p>
            Web3polyu ensures security through:
          </p>
          <ul>
            <li><strong>Non-custodial Architecture:</strong> Private keys never leave users' local devices, secured by hardware-grade wallet protection</li>
            <li><strong>Blockchain Anchoring:</strong> All credential fingerprints immutably recorded across Ethereum/IPFS while keeping sensitive data off-chain</li>
            <li><strong>Trust Minimization:</strong> Multi-party computation for credential issuance and decentralized revocation registries eliminate single points of failure</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Right side: Visual representation - Simple image placeholders -->
    <div class="entity-visual">
      <div class="visual-container">
        <transition name="fade" mode="out-in">
          <div v-if="currentContent === 1" class="visual-image">
            <img src="@/assets/image/component.svg" alt="Open-Source Architecture" class="content-image" />
          </div>
          
          <div v-else-if="currentContent === 2" class="visual-image">
            <img src="@/assets/image/tech.svg" alt="AI-Driven Privacy Innovations" class="content-image" />
          </div>
          
          <div v-else-if="currentContent === 3" class="visual-image">
            <img src="@/assets/image/security.svg" alt="Decentralized Security" class="content-image" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</section>


    <!-- Hero Section I -->
    <section class="hero-section">
  <h2 class="hero-title">Digital Trust in One Click</h2>
  <el-row :gutter="20" class="feature-row">
    <!-- Card 1 -->
    <el-col :span="8">
      <el-card class="feature-card">
        <div class="feature-card-icon"><i class="el-icon-refresh"></i></div>
        <div class="feature-card-content">
          <h3>Selective Disclosure</h3>
          <p>Share only required credential details. Reduce data leaks and compliance risks.</p>
        </div>
      </el-card>
    </el-col>

    <!-- Card 2 -->
    <el-col :span="8">
      <el-card class="feature-card">
        <div class="feature-card-icon"><i class="el-icon-phone"></i></div>
        <div class="feature-card-content">
          <h3>Non-transferable & Unique</h3>
          <p>Cryptographically-bound credentials prevent misuse and duplication.</p>
        </div>
      </el-card>
    </el-col>

    <!-- Card 3 -->
    <el-col :span="8">
      <el-card class="feature-card">
        <div class="feature-card-icon"><i class="el-icon-open"></i></div>
        <div class="feature-card-content">
          <h3>Revoke with Confidence</h3>
          <p>Instant credential revocation with ecosystem-wide synchronization.</p>
        </div>
      </el-card>
    </el-col>

    <!-- Card 4 -->
    <el-col :span="8">
      <el-card class="feature-card">
        <div class="feature-card-icon"><i class="el-icon-message"></i></div>
        <div class="feature-card-content">
          <h3>Perfect Privacy</h3>
          <p>Untraceable transactions prevent cross-service tracking.</p>
        </div>
      </el-card>
    </el-col>

    <!-- Card 5 -->
    <el-col :span="8">
      <el-card class="feature-card">
        <div class="feature-card-icon"><i class="el-icon-lock"></i></div>
        <div class="feature-card-content">
          <h3>AI Template Design</h3>
          <p>Auto-generate credential templates using natural language prompts.</p>
        </div>
      </el-card>
    </el-col>

    <!-- Card 6 -->
    <el-col :span="8">
      <el-card class="feature-card">
        <div class="feature-card-icon"><i class="el-icon-help"></i></div>
        <div class="feature-card-content">
          <h3>Seamless Integration</h3>
          <p>Developer-first SDKs and docs for effortless Web3 integration.</p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</section>



    <!-- Section II -->
    <section class="hero-section">
      <h2 class="hero-title">Build your Application</h2>
      <p class="additional-description">
        Empower your solutions with privacy-first identity infrastructure. <br> Web3polyu's zero-knowledge proofs and BBS+ credentials let you integrate secure, user-centric verification.
      </p>
      <el-row :gutter="20" class="feature-row">
        <!-- Card 1 -->
      
          <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/newKYC.svg" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="swiper-card-content">
              <h3>KYC (Know your Customer)</h3>
              <p>Streamline compliance processes by enabling users to share verified identity attributes (age, residency) securely - reducing operational costs while enhancing privacy protection.</p>
            </div>
          </el-card>
        <!-- Card 2 -->
          <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/degree.svg" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="swiper-card-content">
              <h3>Academic Degree
                Verification</h3>
              <p>Enable instant degree verification through tamper-resistant digital credentials. Educational institutions can issue verified credentials that employers can trust, eliminating lengthy verification delays.</p>
            </div>
          </el-card>
        <!-- Card 3 -->
        <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/anti-fraud.png" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="swiper-card-content">
              <h3>Anti-fraud System</h3>
              <p>Prevent impersonation and fraudulent activities through secure identity verification. Real-time credential validation helps protect users and organizations from scams and unauthorized access attempts.</p>
            </div>
          </el-card>
      </el-row>
    </section>
    
    <!-- section IV -->
  <section class="switch-section">  
    <h2 class="switch-title">
      Create your first anonymous credential in four steps</h2>
      <p class="switch-additional-description">
      </p>
    <div class="switch-div">
    <!-- Buttons to switch content -->
    <button 
      :class="{'active': isSelected === 1}" 
      @click="switchTab(1)">
      1. Create DID
    </button>
    <button 
      :class="{'active': isSelected === 2}" 
      @click="switchTab(2)">
      2. Create template
    </button>
    <button 
      :class="{'active': isSelected === 3}" 
      @click="switchTab(3)">
      3. Apply for credential
    </button>
    <button 
      :class="{'active': isSelected === 4}" 
      @click="switchTab(4)">
      4. Show credential
    </button>
    <transition name="fade" mode="out-in">
        <!-- Content that will be shown based on the selected button -->
      <div v-if="isSelected === 1" class="verification-container">
        <!-- Left side: Image section (replacing Video) -->
        <div class="verification-image-container">
          <img 
            src="@/assets/image/createdid.svg" 
            alt="Instant Identity Verification" 
            class="verification-image"
          />
        </div>

        <!-- Right side: Description section -->
        <div class="verification-description">
          <h2 class="verification-title">1. Create DID</h2>
          <p class="verification-text">
            Users can establish their own Decentralized Identifier (DID), which serves as their digital identity foundation. The private keys associated with this DID are securely stored in the user's local wallet, ensuring full user control and sovereignty. 
            <br>
          <br> Meanwhile, the corresponding DID document is registered on a Verifiable Data Registry (VDR) implemented on blockchain technology, providing immutable proof of the identity's existence without revealing sensitive information.
          <br>
          </p>
          
        </div>
      </div>

      <div v-if="isSelected === 2" class="verification-container">
        <!-- Left side: Image section (replacing Video) -->
        <div class="verification-image-container">
          <img 
            src="@/assets/image/template-generator.svg" 
            alt="Reusable Anywhere" 
            class="verification-image"
          />
        </div>

        <!-- Right side: Description section -->
        <div class="verification-description">
          <h2 class="verification-title">2. Create template based on LLM-powered generator</h2>
          <p class="verification-text">
            Our platform provides an AI-powered credential template generation system that streamlines the creation of standardized digital credentials. Leveraging large language model (LLM) technology, issuers can simply describe their credential's purpose and requirements in natural language, and the system will automatically generate an appropriate template structure.
          </p>
          
        </div>
      </div>

      <div v-if="isSelected === 3" class="verification-container">
        <!-- Left side: Image section (replacing Video) -->
        <div class="verification-image-container">
          <img 
            src="@/assets/image/applycredential.svg" 
            alt="Reusable Anywhere" 
            class="verification-image"
          />
        </div>

        <!-- Right side: Description section -->
        <div class="verification-description">
          <h2 class="verification-title">3. Apply for credential</h2>
          <p class="verification-text">
            When users need verifiable credentials, they can submit applications to relevant issuers. During this process, users complete the credential request by filling out the required attributes as defined in the issuer's template and including their DID as the credential subject. The application is then securely transmitted to the issuer who verifies the information before issuing the credential, establishing a trusted digital representation of the user's qualifications or attributes.
          </p>
          
        </div>
      </div>

      <div v-if="isSelected === 4" class="verification-container">
        <!-- Left side: Image section (replacing Video) -->
        <div class="verification-image-container">
          <img 
            src="@/assets/image/credentialPresentation.svg" 
            alt="Reusable Anywhere" 
            class="verification-image"
          />
        </div>

        <!-- Right side: Description section -->
        <div class="verification-description">
          <h2 class="verification-title">4. Show credential</h2>
          <p class="verification-text">
            Our system empowers users with selective disclosure capabilities, allowing them to share only the specific credential attributes they choose while keeping sensitive information private. For example, a user with an academic credential might reveal their degree type (Bachelor's) without disclosing their specific institution. Additionally, the system supports predicate proof generation, enabling users to prove facts about their attributes without revealing the actual values—such as demonstrating they fall within an age range of 18-60 years old without disclosing their exact age. These privacy-preserving presentations are cryptographically verifiable, maintaining trust while protecting user privacy.
          </p>
          
        </div>
      </div>
      
    </transition>
  </div>
  </section>

<!-- Demonstration Section -->
<section class="demonstration-section">
  <h2 class="section-title">Demonstration</h2>
  <p class="section-description">
    See Web3polyu in action with our comprehensive demonstration video. Learn how our decentralized identity infrastructure works in real-world applications.
  </p>
  <div class="video-container">
    <iframe 
      src="https://www.youtube.com/embed/JseIY-rK0qE?si=fg1awuKM_nVJq23e" 
      title="Web3polyu Demonstration" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>
  </div>
</section>

  
<!-- Contact Section -->
<section class="contact-section">
  <h2 class="section-title">Our Team</h2>
  <p class="section-description">
    Meet the talented individuals behind Web3polyu and get in touch with us for collaboration or inquiries.
  </p>
  
  <div class="team-container">
    <el-row :gutter="20">
      <!-- Team Member 1 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="team-card">
          <div class="team-member-info">
            <h3>Prof. Bin Xiao</h3>
            <p class="team-role">Supervisor</p>
            <p class="team-description">
              Supervise the whole project.
            </p>
            <div class="contact-info">
              <p><i class="el-icon-message"></i> b.xiao@polyu.edu.hk</p>
              <p><i class="el-icon-link"></i> <a href="https://web.comp.polyu.edu.hk/csbxiao/activities.html" target="_blank">Personal Webpage</a></p>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- Team Member 2 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="team-card">
          <div class="team-member-info">
            <h3>Xuyuan Cai</h3>
            <p class="team-role">Backend Developer</p>
            <p class="team-description">
              Responsible for the whole project and the backend development.
            </p>
            <div class="contact-info">
              <!-- <p><i class="el-icon-message"></i> xuyuancai@polyu.edu.hk</p> -->
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- Team Member 3 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="team-card">
          <div class="team-member-info">
            <h3>Rui Song</h3>
            <p class="team-role">Cryptography Specialist</p>
            <p class="team-description">
              Expert in anonymous credential cryptography implementation.
            </p>
            <div class="contact-info">
              <!-- <p><i class="el-icon-message"></i> ruisong@polyu.edu.hk</p> -->
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Team Member 4 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="team-card">
          <div class="team-member-info">
            <h3>Bowen Cui</h3>
            <p class="team-role">Cryptography Specialist</p>
            <p class="team-description">
              Expert in zero-knowledge proofs.
            </p>
            <div class="contact-info">
              <!-- <p><i class="el-icon-message"></i> bowencui@polyu.edu.hk</p> -->
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- Team Member 5 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="team-card">
          <div class="team-member-info">
            <h3>Zixuan Wang</h3>
            <p class="team-role">Frontend Developer</p>
            <p class="team-description">
              Responsible for frontend development.
            </p>
            <div class="contact-info">
              <!-- <p><i class="el-icon-message"></i> zixuanwang@polyu.edu.hk</p> -->
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- Team Member 6 -->
      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
        <el-card class="team-card">
          <div class="team-member-info">
            <h3>Bin Xie</h3>
            <p class="team-role">Cryptography Specialist</p>
            <p class="team-description">
              Expert in smart contract development.
            </p>
            <div class="contact-info">
              <!-- <p><i class="el-icon-message"></i> binxie@polyu.edu.hk</p> -->
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</section>



  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      isSelected: 1, // Default selected tab
      contactForm: {
        name: '',
        email: '',
        message: ''
      },
      currentContent: 1 // Default content for entity resolution section
    };
  },
  methods: {
    switchTab(tab) {
      this.isSelected = tab;
    },
    submitForm() {
      // Here you would implement the logic to send the form data
      console.log('Form submitted:', this.contactForm);
      // Reset form after submission
      this.contactForm = {
        name: '',
        email: '',
        message: ''
      };
      // Show a success message (you can use Element UI's notification system)
      this.$message({
        message: 'Thank you for your message! We will get back to you soon.',
        type: 'success'
      });
    },
    changeContent(contentId) {
      this.currentContent = contentId;
      // Remove active class from all feature points
      const featurePoints = document.querySelectorAll('.feature-point');
      featurePoints.forEach(point => {
        point.classList.remove('active');
      });
      
      // Add active class to the hovered feature point
      featurePoints[contentId - 1].classList.add('active');
    }
  }
};
</script>


<style scoped>
/* Hero Section */
.hero-section {
  text-align: left;
  padding: 60px 20px;
}

.hero-title {
  font-size: 3.25rem;
  font-weight: 800;
  margin-bottom: 30px;
  letter-spacing: -1px;
  line-height: 1.2;
  color: var(--text-dark);
  max-width: 1000px;
}

/* Feature Cards */
.feature-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

/* Feature Cards */
.feature-card {
  padding: 10px; /* Increased padding */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
  height: 230px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 15px; /* Added margin at the bottom */
}

.feature-card:hover {
  transform: translateY(-5px); /* Changed to more subtle up movement instead of scale */
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15); /* Enhanced shadow on hover */
}

.feature-card-icon {
  font-size: 24px;
  color: #081bec;
  /* margin-right: 10px;  Adjust margin between icon and text */
  align-self: flex-start; /* Ensure the icon aligns left */
  display: inline-block; /* Make sure icon is on the same line as text */
}

.feature-card-content {
  /* display: flex; */
  flex-direction: column;
  justify-content: flex-start;
}

.feature-card-content h3 {
  font-size: 20px; /* Increased font size */
  font-weight: 600; /* Made font slightly bolder */
  margin-top: 8px; /* Reduced margin at the top */
  margin-bottom: 7px; /* Reduced space between title and text */
  color: #333; /* Darkened text color for better contrast */
  text-align: left; /* Center align the title */
  line-height: 1.2; /* Reduced line height for tighter text */
}

.feature-card-content p {
  font-size: 1.1rem;
  color: var(--text-medium);
  margin-bottom: 5px;
  /*width: 300px;  Adjust max-width to ensure text does not go too wide */
  word-wrap: break-word;
  text-align: left;
}

/* Adjust spacing between cards */
.el-col {
  padding: 10px;
}
.additional-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-medium);
  max-width: 1500px;
  margin-bottom: 50px;
}

/* Adjust swiper-card width for each card to take up 50% of the row */
.swiper-row {
  display: flex;
  flex-wrap: wrap; /* Make sure the items wrap when needed */
  gap: 20px; /* Add some spacing between the cards */
  justify-content: space-between; /* Align the cards evenly */
}

.swiper-card {
  width: 30%; /* Ensure two cards per row */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
  height: auto; /* Let the height adjust based on content */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align content at the top */
}

.swiper-card:hover {
  transform: scale(1.05);
}

.swiper-picture {
  display: flex;
  justify-content: center;
  align-items: center;
  /* 可选：如果容器本身也需要固定高度 */
  height: 250px; /* 根据需求调整 */
}

.swiper-picture img {
  height: 250px; /* 固定高度 */
  width: auto; /* 宽度自适应保持比例 */
  object-fit: cover; /* 控制图片填充方式 */
}

.swiper-card-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.swiper-card-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
  text-align: center;
  line-height: 1.3;
}

.swiper-card-content p {
  font-size: 1.1rem;
  color: var(--text-medium);
  margin-bottom: 5px;
  word-wrap: break-word;
  text-align: left;
}

/* Adjust icon image size */
.card-icon-img {
  width: 100%; /* Ensure the image takes the full width of the card */
  max-width: 300px; /* Set a max width for the image */
  height: auto; /* Maintain aspect ratio */
  margin-bottom: 10px;
}

/* section III */
.middle-section {
  text-align: center; /* Center the text and content */
  padding: 60px 20px; /* Add padding to the section */
  background-color: #f9f9f9; /* Optional: Add background color for better visibility */
}

.middle-title {
  font-size: 3.25rem;
  font-weight: 800;
  margin-bottom: 30px;
  letter-spacing: -1px;
  line-height: 1.2;
}

/* Styling for the middle-additional-description */
/* .middle-additional-description {
  max-width: 900px;
  font-size: 1.1rem;
  line-height: 1.7;
  margin: 0 auto 60px;
  text-align: left;
} */
.middle-additional-description {
  max-width: 900px;
  font-size: 1.1rem;
  line-height: 1.7;
  margin: 0 auto 50px;
  text-align: left;
  color: #444;
}

.intro-paragraph {
  font-size: 1.2rem;
  margin-bottom: 30px;
  line-height: 1.8;
}

/* Feature Lists Styling */
.features-container {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  flex-wrap: wrap;
}

.feature-column {
  flex: 1;
  min-width: 300px;
  margin: 0 15px 20px;
  padding: 25px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #2a2a2a;
  position: relative;
  padding-bottom: 10px;
}

.feature-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #313ed1;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.feature-list li {
  margin-bottom: 15px;
  padding-left: 30px;
  position: relative;
  line-height: 1.6;
}

.feature-list li .number {
  position: absolute;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  background-color: #313ed1;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.feature-list li .feature-text {
  display: inline-block;
  vertical-align: middle;
}


/* Styling for the middle feature row (card container) */
.middle-feature-row {
  display: flex;
  justify-content: center; /* Center the card within the row */
  flex-wrap: wrap; /* Ensure cards wrap on smaller screens */
  gap: 20px; /* Add space between the cards */
}

/* Card styles */
.middle-card {
  width: 1800px; /* Set the card width */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align the content to the top */
}

.middle-card:hover {
  transform: scale(1.05); /* Slight zoom effect on hover */
}

.middle-picture {
  display: flex;
  justify-content: center; /* Center the image inside the card */
  align-items: center; /* Center the image vertically */
  margin-bottom: 10px; /* Add space between the image and text */
}

.middle-card-icon-img {
  width: 100%; /* Ensure the image takes the full width of the card */
  max-width: 1850px; /* Optional: Set a max width to ensure the image doesn't stretch too much */
  height: auto; /* Maintain the aspect ratio of the image */
}

.middle-card-content h3 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px; /* Reduced margin between h4 and text */
  text-align: center; /* Ensure the title is centered */
}

.middle-card-content p {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  word-wrap: break-word;
  text-align: left;
}

/* section IV */
.switch-section {
  text-align: center; /* Center the text and content */
  padding: 60px 20px; /* Add padding to the section */
  background-color: #f9f9f9; /* Optional: Add background color for better visibility */
}

.switch-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 30px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.2;
}

.switch-additional-description {
  max-width: 700px;
  margin: 0 auto 40px;
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-medium);
}
.switch-div button {
  background: none;
  border: none;
  font-size: 18px;
  padding: 10px 20px;
  color: #B0B0B0; /* Default grey color */
  border-bottom: 2px solid transparent; /* Transparent bottom border */
  cursor: pointer;
  transition: all 0.1s ease;
}

.switch-div button.active {
  color: black; /* Black text when selected */
  font-weight: bold; /* Bold when selected */
  border-bottom: 2px solid #081bec; /* Green bottom border when selected */
}

.switch-div button:hover {
  opacity: 0.8; /* Slight opacity when hovering */
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
/* div 1 */
.verification-container {
  padding: 60px 20px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

/* Updated image container styles (replaced video) */
.verification-image-container {
  width: 67%;
  border: 5px solid #313ed1;
  border-radius: 10px;
  padding: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.verification-image {
  width: 100%;
  height: auto;
  max-height: 800px;
  object-fit: contain;
  border-radius: 5px;
}

.verification-description {
  width: 50%; /* Description section takes up 50% */
  text-align: left;
}

.verification-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.verification-text {
  font-size: 17px;
  color: #545454;
  line-height: 1.5;
  margin-bottom: 20px;
}

/* Demonstration Section */
.demonstration-section {
  padding: 80px 20px;
  text-align: center;
  /* background-color: #ffffff; */
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 30px;
  letter-spacing: -1px;
  line-height: 1.2;
  color: var(--text-dark);
}

.section-description {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-medium);
  max-width: 800px;
  text-align: left;
  /* margin: 0 auto 50px; */
}

.video-container {
  position: relative;
  width: 80%;
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

/* Contact Section */
/* Contact Section */
.contact-section {
  padding: 80px 20px;
  background-color: #f9f9f9;
}

.team-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 关键修改: el-row需要设置为flex布局，确保每行卡片高度一致 */
.team-container .el-row {
  display: flex;
  flex-wrap: wrap;
}

/* 关键修改: 确保每个el-col高度一致 */
.team-container .el-col {
  display: flex;
  margin-bottom: 30px;
}

.team-card {
  width: 100%; /* 确保卡片占据整个列宽 */
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  /* 移除margin-bottom，因为已经在el-col上设置了 */
  display: flex;
  flex-direction: column;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.team-member-info {
  padding: 20px;
  text-align: left;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.team-member-info h3 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.team-role {
  font-size: 16px;
  font-weight: 500;
  color: #081bec;
  margin-bottom: 15px;
}

.team-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.contact-info {
  margin-top: auto; /* 将联系信息推到底部 */
  font-size: 14px;
  color: #555;
}

.contact-info p {
  margin: 4px 0;
  display: flex;
  align-items: center;
}

.contact-info i {
  margin-right: 8px;
  color: #081bec;
}

.contact-info a {
  color: #081bec;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .team-container .el-col {
    margin-bottom: 20px;
  }
}



/* Standalone Title outside the section */
.standalone-title {
  font-size: 3.25rem;
  font-weight: 800;
  margin-bottom: 30px;
  letter-spacing: -1px;
  line-height: 1.2;
  color: var(--text-dark);
  text-align: left;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
  margin-top: 60px;
}

/* Entity Resolution Section */
.entity-resolution-section {
  padding: 20px 20px 80px 20px;
  background-color: #ffffff;
}

.entity-resolution-container {
  display: flex;
  gap: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.entity-features {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Feature divider - light gray line between items */
.feature-divider {
  border: 0;
  height: 1px;
  background-color: #e0e0e0;
  margin: 5px 0;
}

.feature-item {
  padding: 5px 0;
  transition: all 0.3s ease;
  cursor: pointer;
  color: #222226;
}

.feature-item.active h3 {
  color: #070707;
}

.feature-item h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  /* color: #333; */
  line-height: 1.3;
  transition: color 0.3s ease;
  color: #9c9cb0;
}

/* The feature content style with expand/collapse effects */
.feature-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.5s ease, opacity 0.5s ease, margin 0.3s ease;
  opacity: 0;
}

.feature-content.expanded {
  max-height: 500px;
  opacity: 1;
  margin-top: 10px;
}

.feature-item p {
  font-size: 1rem;
  color: #070707;
  line-height: 1.6;
  margin-bottom: 10px;
}

.feature-item ul {
  padding-left: 20px;
  margin-bottom: 10px;
}

.feature-item li {
  font-size: 1rem;
  color: #131212;
  line-height: 1.6;
  margin-bottom: 8px;
}

.entity-visual {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visual-container {
  /* background-color: #0a1837; */
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.visual-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.content-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}



</style>
