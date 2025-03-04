<template>
  <div>
    <!-- section III -->
    <section class="middle-section">
      <h2 class="middle-title">What is PolyuDID? <br>Get started in minutes.</h2>
      <p class="middle-additional-description">
        PolyuDID is a cutting-edge decentralized identity infrastructure for Web3 applications that prioritizes privacy. Using zero-knowledge proofs and blockchain technology, it enables selective credential disclosure, non-transferable identity claims, unlinkable transactions, and dynamic credential revocation. This open-source middleware integrates easily with any Web3 application, empowering developers to build privacy-first identity systems. PolyuDID has proven its effectiveness through successful implementations in anti-fraud systems and academic credential verification.
      </p>
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
    <!-- Hero Section I -->
    <section class="hero-section">
      <h2 class="hero-title">Digital Trust in One Click</h2>
      <el-row :gutter="20" class="feature-row">
        <!-- Card 1 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="feature-card-icon">
              <i class="el-icon-refresh"></i>
            </div>
            <div class="feature-card-content">
            <h3>Selective Disclosure</h3>
              <p>Enable selective disclosure of credentials, allowing users to prove their identity while revealing only necessary information. Minimize data exposure and liability.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 2 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="feature-card-icon">
              <i class="el-icon-phone"></i>
            </div>
            <div class="feature-card-content">
              <h3>Non-transferable & Unique</h3>
              <p>Ensure credentials cannot be transferred or misused, maintaining the integrity of digital identities through cryptographic binding to their rightful owners.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 3 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="feature-card-icon">
              <i class="el-icon-open"></i>
            </div>
            <div class="feature-card-content">
              <h3>Revoke with Confidence</h3>
              <p>Maintain control over issued credentials with powerful revocation mechanisms. Instantly update credential status across the entire ecosystem when needed.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 4 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="feature-card-icon">
              <i class="el-icon-message"></i>
            </div>
            <div class="feature-card-content">
              <h3>Perfect Privacy through Unlinkability</h3>
              <p>Protect user privacy with transactions that cannot be linked, preventing tracking and correlation across different services and interactions.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 5 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="feature-card-icon">
              <i class="el-icon-lock"></i>
            </div>
            <div class="feature-card-content">
              <h3>LLM-Powered Template Design</h3>
              <p>Automatically generate credential templates using natural language. Simply describe your verification needs and get industry-standard attributes with proper data types, eliminating manual configuration.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 6 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="feature-card-icon">
              <i class="el-icon-help"></i>
            </div>
            <div class="feature-card-content">
              <h3>Seamless Integration</h3>
              <p>Built for developers, by developers. Easy-to-use SDKs and comprehensive documentation make integration into any Web3 application effortless.</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
    <!-- Section II -->
    <section class="hero-section">
      <h2 class="hero-title">Build your Application</h2>
      <p class="additional-description">
        Empower your solutions with privacy-first identity infrastructure. <br> PolyuDID's zero-knowledge proofs and BBS+ credentials let you integrate secure, user-centric verification.
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
      See PolyuDID in action with our comprehensive demonstration video. Learn how our decentralized identity infrastructure works in real-world applications.
    </p>
    <div class="video-container">
      <iframe 
        src="https://www.youtube.com/embed/YOUR_YOUTUBE_VIDEO_ID" 
        title="PolyuDID Demonstration" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  </section>

  <!-- Contact Section -->
  <section class="contact-section">
    <h2 class="section-title">Our Team</h2>
    <p class="section-description">
      Meet the talented individuals behind PolyuDID and get in touch with us for collaboration or inquiries.
    </p>
    
    <div class="team-container">
      <el-row :gutter="20">
        <!-- Team Member 1 -->
        <el-col :span="8">
          <el-card class="team-card">
            
            <div class="team-member-info">
              <h3>Bin Xiao</h3>
              <p class="team-role">Supervisor</p>
              <p class="team-description">
                Supervise the whole project.
              </p>
              <div class="contact-info">
                <p><i class="el-icon-message"></i> b.xiao@polyu.edu.hk</p>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- Team Member 2 -->
        <el-col :span="8">
          <el-card class="team-card">
            
            <div class="team-member-info">
              <h3>Bowen Cui</h3>
              <p class="team-role">Cryptography Specialist</p>
              <p class="team-description">
                Expert in zero-knowledge proofs.
              </p>
              <div class="contact-info">
                <p><i class="el-icon-message"></i> bowencui@polyu.edu.hk</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- Team Member 3 -->
        <el-col :span="8">
          <el-card class="team-card">
            
            <div class="team-member-info">
              <h3>Bin Xie</h3>
              <p class="team-role">Cryptography Specialist</p>
              <p class="team-description">
                Expert in smart contract development.
              </p>
              <div class="contact-info">
                <p><i class="el-icon-message"></i> binxie@polyu.edu.hk</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- Team Member 4 -->
        <el-col :span="8">
          <el-card class="team-card">
            
            <div class="team-member-info">
              <h3>Rui Song</h3>
              <p class="team-role">Cryptography Specialist</p>
              <p class="team-description">
                Expert in anonymous credential cryptography implementation.
              </p>
              <div class="contact-info">
                <p><i class="el-icon-message"></i> ruisong@polyu.edu.hk</p>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- Team Member 5 -->
        <el-col :span="8">
          <el-card class="team-card">
            
            <div class="team-member-info">
              <h3>Zixuan Wang</h3>
              <p class="team-role">Frontend Developer</p>
              <p class="team-description">
                Responsible for user experience and interface development.
              </p>
              <div class="contact-info">
                <p><i class="el-icon-message"></i> zixuanwang@polyu.edu.hk</p>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- Team Member 6 -->
        <el-col :span="8">
          <el-card class="team-card">
            
            <div class="team-member-info">
              <h3>Xuyuan Cai</h3>
              <p class="team-role">Backend Developer</p>
              <p class="team-description">
                Responsible for the whole project and the backend development.
              </p>
              <div class="contact-info">
                <p><i class="el-icon-message"></i> xuyuancai@polyu.edu.hk</p>
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
      }
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
  height: 250px;
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

.middle-additional-description {
  max-width: 900px;
  font-size: 1.1rem;
  line-height: 1.7;
  margin: 0 auto 60px;
  text-align: center;
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
.contact-section {
  padding: 80px 20px;
  background-color: #f9f9f9;
}

.team-container {
  max-width: 1200px;
  margin: 0 auto;
}

.team-card {
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 30px;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.team-member-photo {
  height: 200px;
  overflow: hidden;
}

.team-member-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-member-info {
  padding: 20px;
  text-align: left;
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
  margin-top: 10px;
  font-size: 14px;
  color: #555;
}

.contact-info p {
  margin: 5px 0;
  display: flex;
  align-items: center;
}

.contact-info i {
  margin-right: 8px;
  color: #081bec;
}


</style>
